export default function MerchantPublicPage({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <h1 className="font-sora text-2xl font-bold text-navy">{params.slug}</h1>
      <p className="mt-2 text-text-grey">Page commerçant — en construction</p>
      <button className="mt-6 rounded-lg bg-coral px-6 py-3 font-medium text-white transition-colors hover:bg-coral/90">
        Rejoindre le programme
      </button>
    </main>
  )
}
