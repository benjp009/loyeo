import Link from 'next/link';

export default function GettingStarted() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-3xl prose prose-slate">
        <Link href="/" className="text-primary-600 hover:underline mb-8 inline-block">
          &larr; Back to Docs
        </Link>

        <h1>Getting Started</h1>

        <p>
          This guide will help you set up your local development environment for Loyeo.
        </p>

        <h2>Prerequisites</h2>
        <ul>
          <li><strong>Node.js</strong> 22 or later</li>
          <li><strong>pnpm</strong> 10 or later</li>
          <li><strong>Firebase CLI</strong> (<code>npm install -g firebase-tools</code>)</li>
        </ul>

        <h2>Installation</h2>

        <h3>1. Clone the repository</h3>
        <pre><code>git clone https://github.com/benjp009/loyeo.git
cd loyeo</code></pre>

        <h3>2. Install dependencies</h3>
        <pre><code>pnpm install</code></pre>

        <h3>3. Set up environment variables</h3>
        <pre><code>cp .env.example .env.local</code></pre>
        <p>Edit <code>.env.local</code> with your Firebase configuration.</p>

        <h3>4. Start the development servers</h3>
        <pre><code>pnpm dev</code></pre>

        <p>This will start:</p>
        <ul>
          <li>Web app at <a href="http://localhost:3000">http://localhost:3000</a></li>
          <li>Docs at <a href="http://localhost:3001">http://localhost:3001</a></li>
          <li>Firebase emulators at <a href="http://localhost:4000">http://localhost:4000</a></li>
        </ul>

        <h2>Available Commands</h2>
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>pnpm dev</code></td>
              <td>Start all apps in development mode</td>
            </tr>
            <tr>
              <td><code>pnpm build</code></td>
              <td>Build all apps for production</td>
            </tr>
            <tr>
              <td><code>pnpm lint</code></td>
              <td>Run ESLint across all packages</td>
            </tr>
            <tr>
              <td><code>pnpm type-check</code></td>
              <td>Run TypeScript type checking</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
