# Failure Scenarios and System Behavior

This document describes common failure scenarios and how the system
handles them safely without violating delivery guarantees.

## Failure Handling Philosophy

The system assumes that failures are normal. Network timeouts, process
crashes, and duplicate message delivery are expected and explicitly
handled.

### Consumer Crash During Notification Processing

**What Happens**
- A consumer crashes after receiving a message but before acknowledging it.

**System Behavior**
- The message is re-delivered by the queue.
- Idempotency constraints prevent duplicate notifications.

**Guarantee Preserved**
- At-least-once processing
- No duplicate side effects

### Duplicate Message Delivery

**What Happens**
- The same event is delivered multiple times by the queue.

**System Behavior**
- Database uniqueness constraints ensure only one notification is sent.

**Guarantee Preserved**
- Exactly-once side effects via idempotency

### External Webhook Endpoint Unavailable

**What Happens**
- HTTP requests to a webhook fail or timeout.

**System Behavior**
- The notification attempt is retried with exponential backoff.
- After retry exhaustion, the message is sent to the Dead Letter Queue.

**Guarantee Preserved**
- Failure isolation
- Eventual delivery if the endpoint recovers

### Poison Message (Non-Retryable Failure)

**What Happens**
- An event payload causes repeated processing failures.

**System Behavior**
- Retries are attempted up to a fixed limit.
- The message is routed to the DLQ for manual inspection.

**Guarantee Preserved**
- System stability
- Other messages are not blocked

### Database Outage

**What Happens**
- The database is temporarily unavailable.

**System Behavior**
- Event ingestion fails fast.
- No messages are published without persistence.

**Guarantee Preserved**
- No message loss
- Data integrity

## Dead Letter Queue and Recovery

Messages in the DLQ can be inspected, fixed, and replayed manually without
impacting normal message flow.

## Summary

By explicitly modeling failure scenarios, the system ensures correctness
and reliability even under adverse conditions.

