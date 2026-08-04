"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider">Website error</p>
          <h1 className="mt-4 text-4xl font-semibold">The website could not finish loading</h1>
          <p className="mt-4 leading-7">Please try again. If the problem continues, return to the home page and use the contact options available there.</p>
          <button type="button" onClick={reset} className="mt-8 min-h-12 rounded bg-blue-950 px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4">Try again</button>
        </main>
      </body>
    </html>
  )
}
