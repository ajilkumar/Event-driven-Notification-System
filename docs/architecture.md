# Architecture Overview

This document describes the high-level architecture of the Event-Driven
Notification System, including its components, responsibilities, and
design principles.

## System Overview

The Event-Driven Notification System is a backend-only system responsible
for reliably delivering notifications (email and webhooks) triggered by
internal system events.

The system is designed to be asynchronous, fault-tolerant, and resilient
to partial failures. All notification delivery is handled outside of the
request-response lifecycle using message queues and background workers.

## Design Principles

- **Asynchronous First**
  All notification delivery happens asynchronously. APIs return quickly
  and do not block on external dependencies.

- **At-Least-Once Delivery**
  Messages may be delivered more than once. System correctness does not
  depend on exactly-once guarantees.

- **Idempotency Over Exactly-Once**
  Duplicate message processing is expected and handled safely using
  idempotent operations and database constraints.

- **Failure as a First-Class Concern**
  Crashes, timeouts, and retries are assumed to be normal operating
  conditions.

- **Separation of Concerns**
  Event ingestion, message transport, and notification delivery are
  handled by separate components.

## High-Level Components

### Event API Service
- Accepts events via HTTP API
- Validates and persists events
- Publishes events to the message queue
- Does not interpret event payload semantics

### Message Queue (RabbitMQ)
- Buffers events for asynchronous processing
- Decouples producers from consumers
- Handles retries and dead-lettering

### Consumer Worker Service
- Consumes events from the queue
- Determines notification channels
- Delivers notifications (email/webhook)
- Handles retries and failures safely

### Persistence Layer (PostgreSQL)
- Stores immutable event records
- Tracks notification delivery state
- Enforces idempotency via constraints

### Cache Layer (Redis)
- Used for rate limiting and optional idempotency locks
- Not a source of truth

## Data Flow

1. A client submits an event to the Event API Service.
2. The event is validated and persisted in the database within a
   transaction.
3. After successful persistence, the event is published to the message
   queue.
4. A consumer worker retrieves the event asynchronously.
5. The worker attempts to deliver notifications.
6. On failure, the message is retried with backoff.
7. After retry exhaustion, the message is routed to a Dead Letter Queue.

## Delivery Guarantees

The system provides the following guarantees:

- Events are processed at least once.
- Notifications are never delivered more than once per channel.
- Notification delivery is eventually consistent.
- Failures in one notification do not block others.

The system does not guarantee message ordering or synchronous delivery.

## Deployment Model

Each service is deployed independently as a containerized application.
Local development simulates production using Docker Compose, including
PostgreSQL, RabbitMQ, and Redis.

## Summary

This architecture prioritizes reliability, correctness, and operational
simplicity over premature optimization, mirroring real-world backend
systems.
