<h1 align= 'center'>
    Event Driven Notification System
</h1>

![NodeJS](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A fault-tolerant, event-driven backend system that reliably delivers notifications (Email and Webhooks) using asynchronous processing, idempotency, retries, and dead-letter queues.

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing & Verification](#testing--verification)
- [CI/CD Pipeline](#cicd-pipeline)

## Overview

When important events occur inside a system (e.g., "User Signed Up"), external parties must be notified reliably—even when parts of the system fail. This project demonstrates a **Senior-Level** backend architecture that decouples event ingestion from processing to ensure **responsiveness** and **reliability**.

## Technology Stack

- **Language**: TypeScript (Strict Mode)
- **Runtime**: Node.js
- **Database**: PostgreSQL (pg)
- **Message Broker**: RabbitMQ (amqplib)
- **Logging**: Winston (@shared/logger)
- **Testing**: Jest, Supertest
- **Validation**: Zod
- **CI/CD**: GitHub Actions
- **Infrastructure**: Docker, Docker Compose

## Key Features

- **Event-Driven Architecture**: Decouples producers (API) from consumers (Worker) using RabbitMQ.
- **Resilience & Reliability**:
  - **Retries**: Automatically retries failed jobs with exponential backoff.
  - **Dead Letter Queue (DLQ)**: Captures permanently failed messages for inspection.
  - **Graceful Shutdown**: Handles `SIGTERM` to safely finish active jobs before exiting.
- **Observability**:
  - **Structured Logging**: JSON logs via `winston` for easy parsing.
  - **Correlation IDs**: Traces requests from API -> Queue -> Worker.
- **Data Integrity**:
  - **Transactional Outbox** (Simulated via Flow): Database commit happens before event publication.
  - **Idempotency**: Ensures notifications are sent exactly once per channel.
- **Testing**:
  - **Manual Chaos**: Toggle `FAILURE_PROBABILITY` in `.env` to test system stability under load.
- **Security**:
  - **Secret Isolation**: All credentials (DB/Queue) are moved to environment variables.
  - **Environment Templates**: Standardized `.env.example` for secure setup.
- **Automation**:
  - **CI/CD**: Fully automated test and build verification on push.
  - **Auto-Migrations**: Database schema initializes automatically on container startup.

## Architecture

1.  **Event API**: Receives HTTP `POST /events`. Validates payload (Zod). Persists to Postgres. Publishes to RabbitMQ. Returns `202 Accepted`.
2.  **RabbitMQ**: Buffers messages. Handles routing (Fanout exchange).
3.  **Worker**: Consumes messages. Simulates Email/Webhook delivery. Updates status in Postgres.

## Folder Structure

```
event-driven-notification-system
├── .github/workflows   # CI/CD Workflows
├── services
│   ├── event-api       # Express.js API Service
│   │   └── Dockerfile
│   └── worker          # Background Consumer Service
│       └── Dockerfile
├── shared
│   └── logger          # Shared Winston bundle
├── database            # Automatic SQL Migrations
├── docs                # ADRs & Architecture detail
├── .env.example        # Secrets template
├── docker-compose.yml  # System Orchestration
└── package.json        # Workspace management
```

## Prerequisites

- **Docker** & **Docker Compose**
- **Node.js** (v18+) (Optional, for local dev)

## Quick Start

The entire system is containerized. You can spin it up with one command.

1.  **Environment Setup**:
    Copy the example environment file to the root:
    ```bash
    cp .env.example .env
    ```

2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```

3.  **Access Points**:
    - **API**: `http://localhost:3000`
    - **RabbitMQ**: `http://localhost:15672` (guest/guest)
    - **Postgres**: `localhost:5432` 

*Note: Database tables are created automatically on the first run.*

## Testing & Verification

### 1. Automated Tests
Run the unit test suite (Jest):
```bash
npm test
```

### 2. Manual Verification
Send a test event to see the system in action:

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "id": "e605d3b6-15df-4206-8c9e-5f9630717208",
    "type": "USER_CREATED",
    "version": 1,
    "payload": { "email": "test@example.com" },
    "occurredAt": "2023-01-01T00:00:00Z"
  }'
```

**Watch the logs!** You will see the API accept it, and the Worker process it.

### Simulate Failures
To see the **Retry & DLQ** logic in action:
1.  Change `FAILURE_PROBABILITY=1` in your `.env` file.
2.  Restart the worker.
3.  The next request will fail 5 times (visible in logs) and then move to the Dead Letter Queue.

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- Spins up a real PostgreSQL 15 instance.
- Runs full Jest test suites.
- Verifies Docker image compilation for both services.

Checks run automatically on all pushes to `main` and `develop`.

