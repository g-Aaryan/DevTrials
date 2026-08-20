# DevTrails - SubmissionService

SubmissionService handles code submissions from users, records submission metadata in MongoDB, produces execution jobs onto the Redis BullMQ queue, and exposes submission status & execution metrics.

---

## 🚀 Overview & Functionality

- **Code Submission Ingestion**: Receives source code, programming language (`cpp`, `python`, `javascript`, `java`), problem ID, and user ID.
- **BullMQ Producer**: Enqueues code execution payloads `{ submissionId, problemId, language, sourceCode }` into the `submission` queue on Redis.
- **Verdict Persistence**: Receives async PATCH updates from `JudgeService` to store final verdicts (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPLETED`, `FAILED`).
- **User History**: Serves submission history per user or per problem with metrics (Execution Time in ms, Memory Used in KB).

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

### `Submission` Schema (`submissions` collection)

```typescript
interface ISubmission {
  userId: string;
  problemId: string;
  language: "cpp" | "python" | "java" | "javascript";
  sourceCode: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  verdict: "PENDING" | "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "COMPILE_ERROR" | "RUNTIME_ERROR";
  executionTime?: number; // in milliseconds
  memoryUsed?: number; // in KB
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📡 API Endpoints Specification

Base Path: `/api/v1/submissions`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Auth | Submit code for evaluation (creates DB record & pushes BullMQ job) |
| `GET` | `/my` | Auth | Fetch all submission history for the logged-in user |
| `GET` | `/:id` | Auth | Get submission status and verdict by submission ID |
| `GET` | `/problem/:problemId` | Auth | Get user submissions for a specific problem |
| `GET` | `/all` | Admin | Retrieve all platform submissions (filtered by status or verdict) |
| `PATCH` | `/:submissionId` | Internal/Judge | Internal endpoint used by `JudgeService` to update verdict & status |
| `DELETE` | `/:id` | Admin | Delete a submission record |

---

## ⚙️ Configuration & Environment

Default Port: `3002`

```env
PORT=3002
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/submission_db
REDIS_HOST=localhost
REDIS_PORT=6379
```