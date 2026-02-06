export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <h1 className="font-sora text-4xl font-bold text-navy">Loyeo</h1>
      <p className="mt-4 text-lg text-text-grey">La fidélité, simplifiée.</p>
      <div className="mt-8 flex gap-4">
        <a
          href="/dashboard"
          className="rounded-lg bg-coral px-6 py-3 font-medium text-white transition-colors hover:bg-coral/90"
        >
          Espace Commerçant
        </a>
        <a
          href="/my"
          className="rounded-lg border border-coral px-6 py-3 font-medium text-coral transition-colors hover:bg-coral/10"
        >
          Mon Espace Client
        </a>
      </div>
      <p className="mt-12 font-space-mono text-sm text-text-grey">v0.1.0</p>
    </main>
  )
}
