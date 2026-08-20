# DevTrails - LeaderboardService

LeaderboardService manages real-time competitive rankings, global scores, problem-solve duplicate prevention, and user leaderboard queries powered by high-performance Redis Sorted Sets (`ZSET`).

---

## 🚀 Overview & Functionality

- **Real-Time Score Increments**: Accrues points upon receiving `ACCEPTED` submissions from `JudgeService`.
- **Duplicate Solve Prevention**: Uses Redis Sets (`SET`) per user to track solved problems so users only earn points once per problem.
- **Global Rank Query**: Serves user scores and 1-based ranks using `ZREVRANK` and `ZSCORE`.
- **Paginated Leaderboard**: Returns top developers ranked by total points using `ZREVRANGE WITHSCORES`.

---

## 🗄️ Redis Data Structures & Scoring Rules

### 1. Scoring System

| Problem Difficulty | Points Awarded |
| :--- | :--- |
| **EASY** / `easy` | **10 pts** |
| **MEDIUM** / `medium` | **20 pts** |
| **HARD** / `hard` | **30 pts** |

### 2. Redis Schema

- **Global Leaderboard (`ZSET`)**: `leaderboard:global`
  - Member: `userId`
  - Score: Cumulative Points (e.g. `100`)
- **User Solved Problems (`SET`)**: `leaderboard:solved:{userId}`
  - Member: `problemId` (Prevents duplicate score accumulation)

---

## 📡 API Endpoints Specification

Base Path: `/api/v1/leaderboard`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/score` | Internal/Judge | Process accepted submission: awards points (if first time solved) and updates Redis ZSET |
| `GET` | `/` | Public | Get paginated global leaderboard list (supports `?page=1&limit=10`) |
| `GET` | `/:userId` | Public | Get current score for a specific user ID |
| `GET` | `/:userId/rank` | Public | Get global 1-based rank for a specific user ID |

---

## ⚙️ Configuration & Environment

Default Port: `3010`

```env
PORT=3010
REDIS_HOST=localhost
REDIS_PORT=6379
```