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

## Message Queue Topology

The system uses RabbitMQ to decouple event ingestion from notification
processing. Reliability is achieved through explicit queue topology
rather than complex application logic.

### Exchange
- Name: `events.exchange`
- Type: `fanout`
- Durable: true

The fanout exchange allows future consumers to subscribe to events
without changing the producer.

### Queues

#### Main Queue (`events.main.queue`)
- Durable: true
- Manual acknowledgements enabled
- Primary queue consumed by worker services

#### Retry Queue (`events.retry.queue`)
- Used to introduce delay before retrying failed messages
- Configured using message TTL and dead-lettering
- Messages are automatically routed back to the main queue after delay

#### Dead Letter Queue (`events.dlq.queue`)
- Captures messages that exceed retry limits or fail permanently
- Used for inspection, debugging, and manual replay

## Retry and Backoff Strategy

The system implements retries using RabbitMQ dead-lettering and message
TTL rather than synchronous retries in application code.

- Failed messages are negatively acknowledged (`NACK`)
- Messages are routed to a retry queue with a configured delay
- After the delay expires, messages are re-delivered to the main queue
- Retry attempts are tracked using message headers

The maximum retry count is bounded to prevent infinite retry loops.
Messages exceeding this limit are routed to the Dead Letter Queue.

## Acknowledgement Semantics

Workers acknowledge messages only after successful notification delivery.

- `ACK` is sent only after side effects complete successfully
- `NACK` is used for recoverable failures
- Messages are never acknowledged prematurely

This ensures that message loss does not occur even if a worker crashes
mid-processing.

## Design Trade-offs

- The system favors at-least-once delivery over exactly-once semantics
- Idempotency is enforced at the database level rather than the queue
- Message ordering is not guaranteed
- Queue-level retries reduce application complexity

These trade-offs prioritize reliability, simplicity, and operational
clarity.


