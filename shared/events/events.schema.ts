export interface EventEnvelope<TPayload = unknown> {
  id: string;
  type: string;
  version: number;
  payload: TPayload;
  occurredAT: string;
  correlation?: string;
}
