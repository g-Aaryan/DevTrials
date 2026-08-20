# DevTrails - JudgeService

JudgeService is the core execution and evaluation engine for DevTrails. It consumes code submission jobs from BullMQ, spawns isolated Docker containers to run code against hidden test cases, compares actual vs. expected output, updates submission verdicts, and notifies the LeaderboardService on accepted solutions.

---

## 🚀 Overview & Functionality

- **BullMQ Worker / Consumer**: Listens on the `submission` Redis queue.
- **Docker Sandboxing**: Spawns isolated Docker containers (`gcc:latest`, `python:3.12`, `node:22`, `eclipse-temurin:21-jdk`) for execution.
- **Base64 Shell Encoding**: Encodes code & stdin input into Base64 (`echo '${codeB64}' | base64 -d > code.ext`) to avoid shell quote corruption, quote escapes, and multi-line breaks.
- **Docker Stream Demuxing**: Demuxes 8-byte Docker header streams (`streamType` + 4-byte payload size) to extract clean `stdout` logs.
- **Verdict Generator**: Evaluates testcase results to assign final verdicts (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`).
- **Leaderboard Integration**: On `ACCEPTED` verdict, extracts `userId` and `problem.difficulty` and invokes `LeaderboardService` to award points.

---

## 🐳 Docker Container Execution Architecture

```
[BullMQ Queue] ──► [Judge Consumer]
                         │
                         ├─► Fetch Hidden Testcases from ProblemService (Port 3000)
                         │
                         ├─► Create Docker Container (dockerode)
                         │   ├── Base64 decode code & input
                         │   ├── Execute in sandbox
                         │   └── Enforce 10s Execution Timeout
                         │
                         ├─► Demux 8-byte Docker stream headers & compare output
                         │
                         ├─► PATCH Verdict to SubmissionService (Port 3002)
                         │
                         └─► (If ACCEPTED) POST Score to LeaderboardService (Port 3010)
```

---

## 💻 Supported Languages & Docker Images

| Language | Docker Image | Compilation / Execution Command |
| :--- | :--- | :--- |
| **C++** | `gcc:latest` | `g++ code.cpp -o run && ./run < input.txt` |
| **Python** | `python:3.12` | `python3 code.py < input.txt` |
| **JavaScript** | `node:22` | `node code.js < input.txt` |
| **Java** | `eclipse-temurin:21-jdk` | `javac Main.java && java Main < input.txt` |

---

## ⚙️ Configuration & Environment

Default Port: `3001`

```env
PORT=3001
REDIS_HOST=localhost
REDIS_PORT=6379
PROBLEM_SERVICE_URL=http://localhost:3000/api/v1/problem
SUBMISSION_SERVICE_URL=http://localhost:3002/api/v1/submissions
LEADERBOARD_SERVICE_URL=http://localhost:3010/api/v1/leaderboard/score
```
