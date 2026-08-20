# DevTrails — Judge Service

The **Judge Service** is responsible for executing and evaluating user code submissions in the DevTrails coding platform.

It consumes submission jobs from a **Redis/BullMQ queue**, retrieves the required problem and hidden test cases from the Problem Service, executes the submitted code inside Docker containers, compares the generated output with the expected output, determines the final verdict, and updates the corresponding submission through the Submission Service.

---

## Table of Contents

* [Overview](#overview)
* [Responsibilities](#responsibilities)
* [Architecture](#architecture)
* [Submission Judging Flow](#submission-judging-flow)
* [Service Components](#service-components)
* [Worker](#worker)
* [Submission Processor](#submission-processor)
* [Code Execution](#code-execution)
* [Output Comparison](#output-comparison)
* [Verdict Generation](#verdict-generation)
* [Inter-Service Communication](#inter-service-communication)
* [Supported Languages](#supported-languages)
* [Verdicts](#verdicts)
* [Why Docker](#why-docker)
* [Error Handling](#error-handling)
* [Technology Stack](#technology-stack)
* [Future Improvements](#future-improvements)

---

# Overview

The Judge Service is the execution and evaluation engine of DevTrails.

When a user submits code, the Submission Service stores the submission and creates a job in the submission queue.

The Judge Service consumes that job and performs the actual evaluation.

```text
User
 │
 ▼
API Gateway
 │
 ▼
Submission Service
 │
 ├── Save Submission
 │
 └── Create BullMQ Job
          │
          ▼
       Redis
          │
          ▼
     Judge Service
          │
          ├── Get Problem
          ├── Execute Code
          ├── Compare Output
          ├── Generate Verdict
          └── Update Submission
```

---

# Responsibilities

The Judge Service is responsible for:

* Consuming submission jobs from BullMQ
* Fetching problem information
* Fetching hidden test cases
* Executing source code
* Supporting multiple programming languages
* Running code inside Docker containers
* Applying execution time limits
* Applying container memory limits
* Capturing program output
* Detecting runtime failures
* Comparing actual output with expected output
* Generating testcase-level verdicts
* Generating the final submission verdict
* Updating the Submission Service

The Judge Service **does not directly own submission data**.

The Submission Service remains responsible for submission persistence.

---

# Architecture

```text
                    ┌──────────────────┐
                    │  Submission      │
                    │     Service      │
                    └────────┬─────────┘
                             │
                       BullMQ Job
                             │
                             ▼
                    ┌──────────────────┐
                    │      Redis       │
                    └────────┬─────────┘
                             │
                         Consume
                             │
                             ▼
                    ┌──────────────────┐
                    │  Judge Worker    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Submission       │
                    │ Processor        │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       Problem Service   Code Runner    Submission
                            │             Service
                            ▼
                       Docker Engine
                            │
                            ▼
                       Test Results
                            │
                            ▼
                        Comparator
                            │
                            ▼
                    Final Verdict
```

---

# Submission Judging Flow

## 1. Submission Creation

The user submits source code through the API Gateway.

The request reaches the Submission Service.

The Submission Service:

1. Validates the request
2. Verifies the problem
3. Creates the submission record
4. Adds a job to the submission queue

The queue job contains information such as:

```text
submissionId
problemId
sourceCode
language
```

---

## 2. Job Consumption

The Judge Service runs a BullMQ Worker.

```ts
const worker = new Worker(
    SUBMISSION_QUEUE,
    async (job) => {
        await processSubmission(job);
    },
    {
        connection: createNewRedisConnection()
    }
);
```

The worker continuously listens for new submission jobs.

---

## 3. Problem Retrieval

The processor retrieves the problem using the Problem Service.

```text
Judge Service
     │
     │ getProblemById(problemId)
     ▼
Problem Service
     │
     ▼
Problem + Hidden Testcases
```

The Judge Service uses the hidden test cases for evaluation.

---

# Submission Processor

The `processSubmission()` function orchestrates the complete judging process.

Its responsibilities are:

```text
Receive Job
    ↓
Get Problem
    ↓
Get Hidden Testcases
    ↓
Execute Source Code
    ↓
Collect Results
    ↓
Compare Outputs
    ↓
Generate Final Verdict
    ↓
Update Submission
```

For every hidden testcase, the source code is executed independently.

```text
Testcase 1 → Docker Container
Testcase 2 → Docker Container
Testcase 3 → Docker Container
...
```

---

# Code Execution

The code execution is handled by the `runcode()` utility.

The Judge Service does not directly execute user code inside the Node.js process.

Instead, it creates a Docker container.

```text
Judge Service
      │
      ▼
   runcode()
      │
      ▼
Docker Container
      │
      ├── Source Code
      ├── Language Runtime
      ├── Test Input
      └── Execution Limits
```

This provides process-level isolation between the Judge Service and user-submitted programs.

---

# Supported Languages

The current allowlist contains:

```text
C++
Python
Java
JavaScript
```

Only languages present in the allowlist can be executed.

```ts
const allowListedLanguage = [
    "cpp",
    "python",
    "java",
    "javascript"
];
```

This prevents arbitrary execution requests for unsupported languages.

---

# Language Execution Commands

The Judge Service uses language-specific commands.

Conceptually:

```text
C++
 ↓
Compile + Execute

Python
 ↓
Python Runtime

Java
 ↓
Compile + Execute

JavaScript
 ↓
Node.js Runtime
```

The command is generated through the language command utility.

```ts
commands[language](code, input)
```

---

# Execution Timeout

Each execution has a time limit.

The current processor configuration uses:

```text
Timeout = 2000 ms
```

If the program exceeds the configured timeout, the Docker container is killed.

```text
Program starts
     │
     ▼
2 seconds
     │
     ├── Finished → Continue
     │
     └── Still running
              │
              ▼
        Kill Container
              │
              ▼
    TIME_LIMIT_EXCEEDED
```

---

# Container Memory Limit

The code runner currently configures a memory limit for the container.

```text
Memory Limit = 1 GB
```

This helps prevent an individual submission from consuming unlimited memory.

---

# Output Collection

After execution, Docker logs are collected.

Both:

```text
stdout
stderr
```

are captured.

The logs are converted into a readable output string and cleaned before being passed to the comparator.

---

# Output Comparison

Successful executions are passed to the output comparator.

The comparator receives:

```text
Expected Output
       +
Actual Output
```

and determines whether the submission produced the correct result.

```text
Expected Output
       │
       ├──────────────┐
       │              │
       ▼              ▼
   Actual Output   Comparator
                       │
                 ┌─────┴─────┐
                 ▼             ▼
              Match        Mismatch
                 │             │
                 ▼             ▼
             ACCEPTED     WRONG_ANSWER
```

---

# Testcase-Level Results

Every testcase generates an individual result.

Example:

```json
[
    {
        "testcase": 1,
        "verdict": "ACCEPTED"
    },
    {
        "testcase": 2,
        "verdict": "WRONG_ANSWER"
    },
    {
        "testcase": 3,
        "verdict": "ACCEPTED"
    }
]
```

These individual results are then passed to the final verdict generator.

---

# Final Verdict

The verdict generator determines the final result of the submission.

Possible results include:

```text
ACCEPTED
WRONG_ANSWER
TIME_LIMIT_EXCEEDED
RUNTIME_ERROR
```

Example:

```text
Testcase 1 → ACCEPTED
Testcase 2 → ACCEPTED
Testcase 3 → ACCEPTED

Final Verdict → ACCEPTED
```

Another example:

```text
Testcase 1 → ACCEPTED
Testcase 2 → WRONG_ANSWER
Testcase 3 → ACCEPTED

Final Verdict → WRONG_ANSWER
```

---

# Updating the Submission

After judging is complete, the Judge Service sends the result back to the Submission Service.

```text
Judge Service
     │
     │ updateSubmission()
     ▼
Submission Service
     │
     ▼
Submission Database
```

The Judge Service does not directly modify the Submission Service's database.

This preserves service ownership and keeps the microservices loosely coupled.

Example:

```ts
await updateSubmission(
    submissionId,
    "COMPLETED",
    finalVerdict
);
```

---

# Complete End-to-End Flow

```text
                         USER
                           │
                           ▼
                    API GATEWAY
                           │
                           ▼
                  SUBMISSION SERVICE
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          Save Submission       Create Job
                                     │
                                     ▼
                                  REDIS
                                     │
                                     ▼
                              JUDGE WORKER
                                     │
                                     ▼
                           processSubmission()
                                     │
                                     ▼
                             Problem Service
                                     │
                                     ▼
                            Hidden Testcases
                                     │
                                     ▼
                                 runcode()
                                     │
                                     ▼
                              Docker Container
                                     │
                                     ▼
                               Program Output
                                     │
                                     ▼
                              compareOutput()
                                     │
                                     ▼
                             Testcase Results
                                     │
                                     ▼
                          generateFinalVerdict()
                                     │
                                     ▼
                             Submission Service
                                     │
                                     ▼
                               Database
```

---

# Error Handling

The Judge Service distinguishes between different execution outcomes.

### Invalid Language

If a language is not supported:

```text
INVALID LANGUAGE
```

### Time Limit Exceeded

If execution exceeds the configured timeout:

```text
TIME_LIMIT_EXCEEDED
```

### Runtime Failure

If the executed program exits unsuccessfully:

```text
RUNTIME_ERROR
```

### Incorrect Output

If execution succeeds but the output does not match:

```text
WRONG_ANSWER
```

### Correct Output

If the program produces the expected output:

```text
ACCEPTED
```

---

# Worker Lifecycle

The BullMQ worker exposes events for monitoring job execution.

```text
Job Received
     │
     ▼
Processing
     │
     ├── Success → COMPLETED
     │
     └── Error   → FAILED
```

The worker also listens for worker-level errors such as Redis or BullMQ errors.

---

# Why Docker?

Running arbitrary user code directly inside the Judge Service would be unsafe.

Docker provides a separate execution environment for each program.

Conceptually:

```text
Judge Service
     │
     ├── Submission A → Container A
     │
     ├── Submission B → Container B
     │
     └── Submission C → Container C
```

This provides a layer of isolation between user programs and the main application.

The execution environment can also enforce resource restrictions such as memory and execution time.

---

# Service Boundaries

The Judge Service follows clear ownership boundaries.

| Service            | Responsibility                       |
| ------------------ | ------------------------------------ |
| API Gateway        | External request routing             |
| Submission Service | Submission lifecycle and persistence |
| Problem Service    | Problems and test cases              |
| Judge Service      | Code execution and evaluation        |
| Redis/BullMQ       | Asynchronous job processing          |
| Docker             | Code execution environment           |

The Judge Service therefore acts as the **execution and evaluation engine**, rather than becoming the owner of submission or problem data.

---

# Technology Stack

* **Node.js**
* **TypeScript**
* **BullMQ**
* **Redis**
* **Docker**
* **Axios / HTTP client for service communication**
* **Logger**
* **MongoDB** indirectly through the Submission Service

---

# Key Design Principles

### Asynchronous Processing

Submissions are processed asynchronously using Redis and BullMQ.

### Service Ownership

The Judge Service does not directly access another service's database.

### Isolation

User code runs inside Docker containers.

### Resource Control

Execution time and memory limits are applied.

### Separation of Concerns

The judging pipeline is separated into:

```text
Worker
Processor
Code Runner
Comparator
Verdict Generator
Service Clients
```

### Extensibility

New programming languages can be added by extending:

```text
Language Allowlist
Language Docker Image
Language Execution Command
```

---

# Future Improvements

Potential improvements for a production-grade judge system include:

* Stronger Docker sandboxing
* CPU limits
* Network isolation
* Process/PID limits
* Filesystem restrictions
* Container capability restrictions
* Better cleanup on unexpected failures
* Parallel testcase execution
* Early termination on failure
* Queue concurrency configuration
* Retry policies
* Better execution metrics
* Distributed judge workers
* Dedicated execution worker pools
* More programming languages
* Resource usage reporting
* Secure compilation environments

These improvements are not required for the current DevTrails MVP but can be introduced as the system scales.

---

# Summary

The Judge Service follows a simple pipeline:

```text
CONSUME
   ↓
FETCH PROBLEM
   ↓
EXECUTE CODE
   ↓
COMPARE OUTPUT
   ↓
GENERATE VERDICT
   ↓
UPDATE SUBMISSION
```

In short:

> **Submission Service manages submissions. Problem Service manages problems and test cases. Judge Service executes and evaluates code. Redis/BullMQ connects submission creation with asynchronous judging. Docker provides the execution environment.**
