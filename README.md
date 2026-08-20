# DevTrails ⚡ - Distributed Microservice Online Judge & Coding Platform

**DevTrails** is a high-performance, distributed competitive programming and online judge platform built with Node.js, Express, TypeScript, React 18, Tailwind CSS, Monaco Editor, Docker, Redis, and MongoDB.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer"]
        FE["React 18 + Vite + Tailwind CSS"]
        ME["Monaco Code Editor"]
    };

    subgraph Gateway ["API Gateway / Reverse Proxy"]
        NGINX["Nginx Reverse Proxy (Port 8000)"]
    };

    subgraph Microservices ["Backend Microservices Layer"]
        AUTH["AuthService (Port 3008)\n- JWT, Sessions, Google OAuth 2.0"]
        PROB["ProblemService (Port 3000)\n- Problems, Testcases, Markdown"]
        SUBM["SubmissionService (Port 3002)\n- Code Ingestion, BullMQ Producer"]
        JUDGE["JudgeService (Port 3001)\n- BullMQ Consumer, Docker Sandbox"]
        LEAD["LeaderboardService (Port 3010)\n- Redis ZSET Leaderboard & Rank"]
    };

    subgraph Storage ["Databases & Message Queue"]
        MONGO_AUTH[("MongoDB Auth DB")]
        MONGO_PROB[("MongoDB Problem DB")]
        MONGO_SUBM[("MongoDB Submission DB")]
        REDIS[("Redis (BullMQ Queue + ZSET Leaderboard)")]
    };

    FE -->|HTTP/REST| NGINX
    NGINX -->|/api/v1/auth| AUTH
    NGINX -->|/api/v1/problem| PROB
    NGINX -->|/api/v1/submissions| SUBM
    NGINX -->|/api/v1/leaderboard| LEAD

    AUTH --> MONGO_AUTH
    PROB --> MONGO_PROB
    SUBM --> MONGO_SUBM
    SUBM -->|Push Job| REDIS

    JUDGE -->|Pop Job| REDIS
    JUDGE -->|Fetch Problem| PROB
    JUDGE -->|Docker Exec| DOCKER[("Docker Container Sandbox\n- gcc:latest\n- python:3.12\n- node:22\n- eclipse-temurin:21-jdk")]
    JUDGE -->|Patch Verdict| SUBM
    JUDGE -->|Update Score| LEAD
    LEAD --> REDIS
```

---

## 🌟 Key Features

1. **Modern Frontend & Code Editor**:
   - Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.
   - Features **Monaco Editor** with language syntax highlighting, code resetting, tabbed descriptions/editorials, and status indicators.
   - Interactive profile page with user stats, score, rank, and submission counts.

2. **Google OAuth 2.0 & Custom Auth**:
   - Supports traditional email/password registration with 6-digit email OTP verification via Nodemailer.
   - One-click Google OAuth 2.0 login with automatic session creation and frontend token handoff.

3. **Isolated Docker Container Sandboxing**:
   - Compiles and runs user submissions inside isolated Docker containers (`gcc:latest`, `python:3.12`, `node:22`, `eclipse-temurin:21-jdk`).
   - Uses **Base64 shell encoding** (`echo '${codeB64}' | base64 -d > code.ext`) to guarantee zero shell quote corruption.
   - Demuxes 8-byte Docker stream headers (`streamType` + 4-byte payload size) to parse clean `stdout`.

4. **Real-time Redis Leaderboard**:
   - Real-time global developer ranking using **Redis Sorted Sets** (`ZSET`).
   - Solved problem duplicate prevention using **Redis Sets** (`SET`).
   - Tiered scoring system: **Easy = 10 pts**, **Medium = 20 pts**, **Hard = 30 pts**.

5. **Nginx API Gateway**:
   - Single port (`8000`) reverse proxy routing traffic smoothly to microservices with rate limiting and CORS support.

---

## 📡 Microservice Sitemap & Ports

| Microservice | Path / Directory | Default Port | Description |
| :--- | :--- | :--- | :--- |
| **Nginx Reverse Proxy** | `Backend/nginx` | `8000` | Gateway & CORS router |
| **AuthService** | `Backend/AuthService` | `3008` | JWT, OTP, Sessions & Google OAuth |
| **ProblemService** | `Backend/ProblemService` | `3000` | Problem statement & testcase storage |
| **SubmissionService** | `Backend/SubmissionService` | `3002` | Code submission ingestion & BullMQ producer |
| **JudgeService** | `Backend/JudgeService` | `3001` | Sandbox worker & Docker code evaluator |
| **LeaderboardService** | `Backend/LeaderboardService` | `3010` | Redis ZSET score tracker & rank calculator |
| **Frontend UI** | `Frontend` | `5173` | React 18 SPA web client |

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- Node.js `v20+`
- Docker Desktop (Installed & running)
- Redis server (`localhost:6379`)
- MongoDB Atlas or local MongoDB instance

### 1. Pull Docker Sandbox Images

```bash
docker pull gcc:latest
docker pull python:3.12
docker pull node:22
docker pull eclipse-temurin:21-jdk
```

### 2. Launch Backend Microservices

In separate terminal windows, start each microservice:

```bash
# AuthService (Port 3008)
cd Backend/AuthService && npm install && npm run dev

# ProblemService (Port 3000)
cd Backend/ProblemService && npm install && npm run dev

# SubmissionService (Port 3002)
cd Backend/SubmissionService && npm install && npm run dev

# JudgeService Worker (Port 3001)
cd Backend/JudgeService && npm install && npm run dev

# LeaderboardService (Port 3010)
cd Backend/LeaderboardService && npm install && npm run dev
```

### 3. Launch Nginx Proxy & Frontend

```bash
# Nginx Proxy (Port 8000)
c:\Users\gupta\Downloads\nginx-1.31.3\nginx-1.31.3\nginx.exe

# Frontend React App (Port 5173)
cd Frontend && npm install && npm run dev
```

Open `http://localhost:5173` in your browser to start coding!

---

## 🎨 User Interface Preview

- **Landing Page**: Animated typewriter hero text, glassmorphism cards, interactive language showcase, and feature highlights.
- **Problem Page**: Split-panel Monaco editor, sample testcase viewers, and real-time execution verdict console.
- **Leaderboard**: Live developer standings, personal rank badge, user ID lookup, and page controls.
- **Profile**: Account details, score card, global rank badge, and total problem stats.

---

## ❤️ Credits

DevTrails Platform — **Made with love by Aaryan Gupta**
