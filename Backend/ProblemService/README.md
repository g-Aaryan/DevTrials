# DevTrails - ProblemService

ProblemService manages problem creation, listing, searching, editing, testcase definitions, and solution editorials for the DevTrails platform.

---

## 🚀 Overview & Functionality

- **Problem Catalog Management**: Stores coding problems with title, detailed markdown description, difficulty rating (`easy`, `medium`, `hard`), topic tags, and constraints.
- **Testcase Management**: Stores both **visible sample testcases** (shown to users in the problem description) and **hidden testcases** (used exclusively by `JudgeService` for evaluating submissions).
- **Sanitization**: Sanitizes markdown descriptions to prevent XSS.
- **Admin Authoring**: Admin endpoints allow adding, updating, and deleting problems.

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

### `Problem` Schema (`problems` collection)

```typescript
interface ITestCase {
  input: string; // Stdin passed to solution (e.g. "[2,7,11,15]\n9")
  output: string; // Expected stdout output (e.g. "[0,1]")
  explanation?: string;
}

interface IProblem {
  title: string; // e.g. "Two Sum"
  description: string; // Full problem statement
  difficulty: "easy" | "medium" | "hard";
  tags: string[]; // e.g. ["Array", "Hashing"]
  constraints: string[]; // e.g. ["2 <= nums.length <= 100000"]
  examples: ITestCase[]; // Sample examples shown on UI
  visibleTestcases: ITestCase[];
  hiddenTestcases: ITestCase[]; // Secret testcases evaluated by sandbox
  editorial?: string; // Solution walkthrough
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📡 API Endpoints Specification

Base Path: `/api/v1/problem`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | List all problems (supports filter by `difficulty`, `tags`, or title `search`) |
| `GET` | `/:id` | Public | Get detailed problem by ID (includes description, constraints, examples, & visible testcases) |
| `POST` | `/` | Admin | Create a new coding problem with visible & hidden testcases |
| `PUT` | `/:id` | Admin | Update an existing problem statement or testcases |
| `DELETE` | `/:id` | Admin | Delete a problem by ID |

---

## ⚙️ Configuration & Environment

Default Port: `3000`

```env
PORT=3000
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lc_problem_db
ACCESS_TOKEN_SECRET=your_access_token_secret
```