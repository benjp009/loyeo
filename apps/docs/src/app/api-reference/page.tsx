import Link from 'next/link';

export default function ApiReference() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-3xl prose prose-slate">
        <Link href="/" className="text-primary-600 hover:underline mb-8 inline-block">
          &larr; Back to Docs
        </Link>

        <h1>API Reference</h1>

        <p>
          The Loyeo API is built with <a href="https://hono.dev/">Hono</a> and runs on Firebase Functions.
        </p>

        <h2>Base URL</h2>
        <ul>
          <li><strong>Development:</strong> <code>http://localhost:5001/PROJECT_ID/us-central1/api</code></li>
          <li><strong>Production:</strong> <code>https://us-central1-PROJECT_ID.cloudfunctions.net/api</code></li>
        </ul>

        <h2>Authentication</h2>
        <p>
          All authenticated endpoints require a Firebase ID token in the Authorization header:
        </p>
        <pre><code>Authorization: Bearer &lt;firebase-id-token&gt;</code></pre>

        <h2>Response Format</h2>
        <p>All API responses follow this structure:</p>
        <pre><code>{`interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}`}</code></pre>

        <h2>Endpoints</h2>

        <h3>Health Check</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET</code></td>
              <td><code>/health</code></td>
              <td>Health check</td>
            </tr>
            <tr>
              <td><code>GET</code></td>
              <td><code>/health/ready</code></td>
              <td>Readiness check</td>
            </tr>
          </tbody>
        </table>

        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET</code></td>
              <td><code>/users</code></td>
              <td>List users</td>
            </tr>
            <tr>
              <td><code>GET</code></td>
              <td><code>/users/:id</code></td>
              <td>Get user by ID</td>
            </tr>
            <tr>
              <td><code>POST</code></td>
              <td><code>/users</code></td>
              <td>Create user</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
