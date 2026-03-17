import { useAppSettings } from '../context/AppSettingsContext'

function HeroSection() {
  const { settings } = useAppSettings()

  return (
    <section id="home" className="border-b border-slate-800/80 py-10 sm:py-12 lg:py-14">
      <p className="mb-4 inline-flex w-fit rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
        {settings.heroBadge}
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
        {settings.heroTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-300">
        {settings.heroSubtitle}
      </p>
      <div className="mt-7">
        <a
          href="#booking"
          className="inline-flex items-center rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          {settings.ctaLabel}
        </a>
      </div>
    </section>
  )
}

export default HeroSection
