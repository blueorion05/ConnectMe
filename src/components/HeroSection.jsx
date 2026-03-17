function HeroSection() {
  return (
    <section
      id="home"
      className="fade-up flex min-h-[42vh] flex-col justify-center border-b border-slate-800/70 py-16 lg:py-20"
    >
      <p className="mb-5 inline-flex w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
        Appointment and Demo Booking
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
        Book a Demo with Klassic Group
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-300">
        Empowering 10 Companies under one ecosystem
      </p>
      <div className="mt-8">
        <a
          href="#booking"
          className="inline-flex items-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          Schedule Now
        </a>
      </div>
    </section>
  )
}

export default HeroSection
