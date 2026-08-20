# DevTrails — Comprehensive System Documentation

This document provides a deep dive into the architecture, database models, security rules, and communication protocols of the DevTrails platform.

---

## 🚀 Port & Environment Mapping

All services are designed to be run concurrently on the same host machine for local development:

| Service Name | Port | Database Name / Tech | Key Env Variables |
| :--- | :---: | :--- | :--- |
| **Auth Service** | `3008` | MongoDB: `auth_db` | `ACCESS_TOKEN_SECRET`, `DB_URL` |
| **Problem Service** | `3000` | MongoDB: `lc_problem_db` | `ACCESS_TOKEN_SECRET`, `DB_URL` |
| **Submission Service** | `3002` | MongoDB: `lc_submission_db` | `ACCESS_TOKEN_SECRET`, `DB_URL`, `REDIS_HOST`, `REDIS_PORT` |
| **Leaderboard Service** | `3010` | Redis: Local instance | `PORT`, `REDIS_HOST`, `REDIS_PORT` |
| **Judge Service** | `3001` | Worker (No DB) | `PORT`, `REDIS_HOST`, `REDIS_PORT`, `SUBMISSION_SERVICE_URL`, `LEADERBOARD_SERVICE_URL` |

---

## 🔒 Security Design (Authentication & RBAC)

Every request modifying resource state (creating problems, submitting solutions, querying user logs) requires authentication.

### Token Verification Flow
1. The client acquires a signed JWT upon logging in via the **Auth Service**.
2. When calling protected endpoints, the client must include the token in the headers:
   `Authorization: Bearer <JWT_ACCESS_TOKEN>`
3. The receiver microservice runs the `authenticateJWT` middleware, which decodes and validates the token using the common `ACCESS_TOKEN_SECRET` key.
4. If verified, the parsed user data is attached to the request context (`req.user = payload`), making `id`, `email`, and `role` properties accessible to controller functions.

### Role-Based Access Control (RBAC)
- **Regular Users (`USER` role)**:
  - Can read problems (`GET /problems`, `GET /problems/:id`).
  - Can submit code (`POST /submissions`).
  - Can retrieve their **own** submissions only (`GET /submissions/me` or `/submissions/:id` with owner verification).
- **Administrators (`ADMIN` role)**:
  - Can create, modify, or delete problems (`POST`, `PUT`, `DELETE` in Problem Service).
  - Can view all submissions globally (`GET /submissions`).
  - Can delete submissions (`DELETE /submissions/:id`).

---

## 💾 Database Schemas

### 1. Problem Schema (`lc_problem_db` -> `Problem`)
```javascript
{
  title: String (Required),
  description: String (Required),
  difficulty: String ["easy", "medium", "hard"] (Required),
  testcases: [
    { input: String, output: String }
  ],
  hiddenTestcases: [
    { input: String, output: String }
  ]
}
```

### 2. Submission Schema (`lc_submission_db` -> `Submission`)
```javascript
{
  userId: String (Required, indexed),
  problemId: String (Required, indexed),
  language: String ["cpp", "java", "python", "javascript"] (Required),
  sourceCode: String (Required),
  status: String ["PENDING", "QUEUED", "RUNNING", "COMPLETED", "FAILED"] (Default: "PENDING"),
  verdict: String ["PENDING", "ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "COMPILATION_ERROR"] (Default: "PENDING"),
  executionTime: Number,
  memoryUsed: Number
}
```

### 3. Leaderboard Storage (Redis)
- **Scores**: Stored in a sorted set (`ZSET`) under the key `leaderboard:global`. Member represents the `userId`, and score represents their cumulative points.
- **Duplicate Prevention**: Stored in a set (`SET`) under the key `leaderboard:solved:${userId}` containing list of solved `problemId` strings. Ensures users only receive points once for solving a problem.

---

## 🚦 Endpoint Verification & Manual Testing Flow

Ensure your local Redis and MongoDB instances are running, and start all backend services. 

### Step 1: Authentication & Token Retrieval
Register a new user:
```bash
curl -X POST http://localhost:3008/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"coder@devtrails.com","password":"securepassword123"}'
```
Log in to receive the access token:
```bash
curl -X POST http://localhost:3008/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"coder@devtrails.com","password":"securepassword123"}'
```
*Note: Copy the `accessToken` value returned. Export it in your console:*
```bash
export TOKEN="Bearer <paste_token_here>"
```

---

### Step 2: Manage Problems (Problem Service)
Create a new problem (requires an ADMIN token):
```bash
curl -X POST http://localhost:3000/api/v1/problem \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    "difficulty": "easy",
    "testcases": [{"input": "[2,7,11,15]\n9", "output": "[0,1]"}],
    "hiddenTestcases": [{"input": "[3,2,4]\n6", "output": "[1,2]"}]
  }'
```
Get all problems (Public: No token required):
```bash
curl -X GET http://localhost:3000/api/v1/problem
```

---

### Step 3: Run and Monitor Code Submissions (Submission & Judge Services)
Submit a solution (Auth token required):
```bash
curl -X POST http://localhost:3002/api/v1/submissions \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "<paste_problem_id_here>",
    "language": "javascript",
    "sourceCode": "function solve() { return [1,2]; }"
  }'
```
Retrieve your submission list:
```bash
curl -X GET http://localhost:3002/api/v1/submissions/me \
  -H "Authorization: $TOKEN"
```
Check submission verdict:
```bash
curl -X GET http://localhost:3002/api/v1/submissions/<paste_submission_id_here> \
  -H "Authorization: $TOKEN"
```

---

### Step 4: Verify Rankings (Leaderboard Service)
Get global rankings:
```bash
curl -X GET http://localhost:3010/api/v1/leaderboard
```
Get specific user score and rank:
```bash
curl -X GET http://localhost:3010/api/v1/leaderboard/<userId>
curl -X GET http://localhost:3010/api/v1/leaderboard/<userId>/rank
```
