export function NewsletterSection() {
  return (
    <section className="border-t border-line bg-cream-dark/50 py-14">
      <div className="mx-auto max-w-lg px-4 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-wide text-charcoal">Join TrendPulse</h2>
        <p className="mt-2 text-sm text-charcoal-soft/70">
          Get 10% off your first order plus early access to sales and new arrivals.
        </p>
        <form className="mt-5 flex h-12 rounded-sm border border-line bg-paper focus-within:border-gold">
          <input type="email" placeholder="Enter your email" className="w-full bg-transparent px-4 text-sm outline-none" />
          <button type="submit" className="shrink-0 rounded-r-sm bg-gold px-8 text-xs font-bold uppercase text-white transition-colors hover:bg-gold-dark">
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
