import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@loyeo/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Loyeo</CardTitle>
          <CardDescription>
            Your modern SaaS platform is ready to build.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-secondary-600">
            This monorepo is set up with Next.js 15, Turborepo, and Firebase.
          </p>
          <div className="flex gap-2">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
