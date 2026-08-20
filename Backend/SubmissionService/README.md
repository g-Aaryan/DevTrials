# DevTrails — Submission Service

The Submission Service is responsible for managing the complete lifecycle of code submissions in the DevTrails platform.

A submission represents an attempt by a user to solve a particular coding problem using a supported programming language.

The service is responsible for:

- Accepting submissions from authenticated users
- Validating submission data
- Associating submissions with users and problems
- Persisting submissions in MongoDB
- Managing submission status
- Queuing submissions for evaluation
- Communicating with the Judge Service
- Updating submissions with evaluation results
- Storing execution metrics
- Providing submission history
- Enforcing user ownership and administrator access
- Providing internal APIs for verdict updates

---

# 1. Role of Submission Service in DevTrails

DevTrails follows a microservice architecture.

The major services involved in the coding flow are:

```text
                    DevTrails
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
   Auth Service    Problem Service   Submission Service
                                          |
                                          |
                                          v
                                    Judge Service
                                          |
                                          v
                                   Code Execution
                                          |
                                          v
                                      Verdict
                                          |
                                          v
                                  Leaderboard Service