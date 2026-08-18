# Leaderboard Service

Leaderboard microservice for the DevTrails coding platform.

## Overview

The Leaderboard Service manages user scores, rankings, and solved-problem tracking using Redis.

## Features

- Score users based on problem difficulty
- Prevent duplicate points for the same problem
- Get user score
- Get user rank
- Get global leaderboard
- Pagination support
- Redis Sorted Sets for ranking
- Redis Sets for solved-problem tracking

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Redis
- ioredis

## Score System

| Difficulty | Points |
|------------|--------|
| EASY       | 10     |
| MEDIUM     | 20     |
| HARD       | 30     |

## API Endpoints

```text
POST /leaderboard/score
GET  /leaderboard
GET  /leaderboard/:userId
GET  /leaderboard/:userId/rank