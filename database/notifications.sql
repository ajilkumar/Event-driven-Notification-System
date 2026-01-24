CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id),
  channel VARCHAR(50) NOT NULL, -- EMAIL, WEBHOOK
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, FAILED
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(event_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_notifications_event_id ON notifications(event_id);
