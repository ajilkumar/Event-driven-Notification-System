# Event-Driven Notification System

![NodeJS](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

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
  - **Unit Tests**: Full coverage with `Jest`.
  - **Simulation**: Worker simulates real-world latency and random network failures to prove resilience.

## Architecture

1.  **Event API**: Receives HTTP `POST /events`. Validates payload (Zod). Persists to Postgres. Publishes to RabbitMQ. Returns `202 Accepted`.
2.  **RabbitMQ**: Buffers messages. Handles routing (Fanout exchange).
3.  **Worker**: Consumes messages. Simulates Email/Webhook delivery. Updates status in Postgres.

## Folder Structure

```
event-driven-notification-system
├── services
│   ├── event-api       # Express.js API Service
│   │   ├── src/controllers
│   │   ├── src/queue   # RabbitMQ Publisher
│   │   └── Dockerfile
│   └── worker          # Background Consumer Service
│       ├── src/handlers # Email/Webhook Logic
│       ├── src/queue   # RabbitMQ Consumer
│       └── Dockerfile
├── shared
│   └── logger          # Shared Winston setup package
├── database            # SQL Migration scripts
├── docs                # Architecture & Decision logs
├── docker-compose.yml  # Orchestration
└── package.json        # Monorepo root
```

## Prerequisites

- **Docker** & **Docker Compose**
- **Node.js** (v18+) (Optional, for local dev)

## Quick Start

The entire system is containerized. You can spin it up with one command.

1.  **Configure Environment**:
    Inside `services/worker`, create a `.env` file from the example:
    ```bash
    cp services/worker/.env.example services/worker/.env
    ```

2.  **Start System**:
    ```bash
    docker-compose up --build
    ```

3.  **That's it!** The system is running.
    - **API**: `http://localhost:3000`
    - **RabbitMQ UI**: `http://localhost:15672` (guest/guest)
    - **Postgres**: Port `5432`

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

**Watch the logs!** You will see the API accept it, and the Worker process it (potentially failing and retrying if simulation is enabled).
