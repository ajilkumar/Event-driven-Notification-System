CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  correlation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events(occurred_at);
