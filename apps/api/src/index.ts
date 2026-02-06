import {
  onRequest,
  type Request as FirebaseRequest,
} from 'firebase-functions/v2/https';
import type { Response as FirebaseResponse } from 'express';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/users';

// Initialize Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://loyeo.com'],
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoutes);
app.route('/users', userRoutes);

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'Loyeo API',
    version: '0.0.1',
    status: 'running',
  });
});

// Firebase adapter for Hono
async function handleRequest(req: FirebaseRequest, res: FirebaseResponse) {
  const url = new URL(req.url, `https://${req.headers.host}`);

  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value)
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  });

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined,
  });

  const response = await app.fetch(request);

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = await response.text();
  res.send(body);
}

// Export as Firebase Function
export const api = onRequest(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  handleRequest
);
