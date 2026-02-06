import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@loyeo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary-50 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Loyeo Documentation
          </h1>
          <p className="text-lg text-secondary-600">
            Everything you need to build with Loyeo
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Set up your development environment and start building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/getting-started">
                <Button>Read Guide</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Explore the API endpoints and data models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/api-reference">
                <Button variant="outline">View API Docs</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Tech Stack
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-medium text-secondary-900">Frontend</h3>
              <p className="text-sm text-secondary-600">
                Next.js 15, React 19, Tailwind CSS
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-medium text-secondary-900">Backend</h3>
              <p className="text-sm text-secondary-600">
                Firebase Functions, Hono
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-medium text-secondary-900">Database</h3>
              <p className="text-sm text-secondary-600">
                Cloud Firestore
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
