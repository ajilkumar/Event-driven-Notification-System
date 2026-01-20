export function getRetryCount(msg: any): number {
  return msg.properties.headers["x-retry-count"] || 0;
}

export function incrementRetry(headers: any) {
  return {
    ...headers,
    "x-retry-count": (headers["x-retry-count"] || 0) + 1
  };
}
