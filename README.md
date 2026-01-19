# Event-Driven Notification System

## Overview
A fault-tolerant, event-driven backend system that reliably delivers
notifications (Email and Webhooks) using asynchronous processing,
idempotency, retries, and dead-letter queues.

## Problem Statement
When important events occur inside a system, external parties must be
notified reliably — even when parts of the system fail.

## Key Characteristics
- Event-driven architecture
- At-least-once delivery semantics
- Idempotent notification processing
- Failure isolation via queues and DLQs
- Asynchronous, non-blocking APIs

## Non-Goals
- No frontend or UI
- No real email providers
- No authentication or user management

## High-Level Architecture
(You will add ASCII diagram later)

## Technology Stack
- Node.js + TypeScript
- RabbitMQ
- PostgreSQL
- Redis (rate limiting, idempotency)
- Docker Compose

## Why This Project Exists
This project demonstrates real-world backend engineering skills:
distributed systems design, failure handling, and operational thinking.
