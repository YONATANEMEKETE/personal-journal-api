import client from 'prom-client';

// 1. Create a custom Registry (or use the default global registry)
export const register = new client.Registry();

// 2. Add default metrics to this registry (e.g. CPU, memory, event loop lag)
client.collectDefaultMetrics({
  register,
  prefix: 'journal_api_', // Optional: Prefixes all default metrics (e.g., journal_api_process_cpu_user_seconds_total)
});

// We will define our custom application-level metrics here in the next steps!

// 3. Define a Counter for request volume and status codes
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status'],
  registers: [register], // Register it with our custom registry
});
// 4. Define a Histogram for request duration/latency
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5], // Latency buckets in seconds
  registers: [register], // Register it with our custom registry
});
