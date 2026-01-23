# Architectural Decision Records (ADR)

This document records the significant architectural decisions made during the project's development.

## 1. Use of RabbitMQ for Asynchronous Processing
- **Context**: We needed to decouple the Event API from the Worker to ensure high availability and responsiveness.
- **Decision**: Selected **RabbitMQ** over Kafka or Redis Pub/Sub.
- **Rationale**:
  - RabbitMQ supports complex routing (Fanout/Direct exchanges) out of the box.
  - Native support for Acknowledgements and Dead Letter Queues (reliability).
  - Lightweight and easy to run via Docker compared to Kafka.

## 2. Shared Library Pattern for Monorepo
- **Context**: Both `event-api` and `worker` needed access to the same Logger configuration.
- **Decision**: Created a `shared` folder and treated it as a local package.
- **Rationale**:
  - Eliminates code duplication.
  - Ensures consistent log formatting (JSON, timestamps, correlation IDs) across the entire distributed system.

## 3. Optimistic Simulation for Resilience Testing
- **Context**: We needed to prove the system handles failures without actually taking down production infrastructure.
- **Decision**: Implemented controlled "chaos" using `Math.random()` in the worker handlers.
- **Rationale**:
  - Allowed us to verify Retries, Backoff, and DLQ logic deterministically in development.
  - Can be easily toggled off for production stability.

## 4. Multi-Stage Docker Builds
- **Context**: Production images need to be small and secure.
- **Decision**: Used multi-stage Dockerfiles (Build stage vs. Run stage).
- **Rationale**:
  - Keeps source code and dev dependencies (TypeScript, Jest) out of the final image.
  - Reduces image size and attack surface.

## 5. Structured JSON Logging with Correlation IDs
- **Context**: Debugging distributed systems is hard when logs are scattered.
- **Decision**: Used `winston` for JSON logs and `x-request-id` headers.
- **Rationale**:
  - Allows log aggregators (like ELK or Datadog) to parse logs automatically.
  - Calculates "end-to-end" request lifecycle by filtering on a single Correlation ID.
