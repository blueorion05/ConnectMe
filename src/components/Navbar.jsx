import logo from '../assets/KGC_logo.png'
import { useAppSettings } from '../context/AppSettingsContext'

function Navbar() {
  const { settings } = useAppSettings()

  return (
    <header className="border-b border-slate-800/80 bg-slate-950">
      <nav className="mx-auto flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Klassic Group of Companies"
            className="h-10 w-auto object-contain"
          />
          <span className="hidden text-sm font-medium tracking-wide text-slate-200 sm:block">
            {settings.brandName}
          </span>
        </a>

        <a
          href="#booking"
          className="rounded-md border border-amber-500/60 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/10 sm:px-4 sm:text-sm"
        >
          {settings.ctaLabel}
        </a>
      </nav>
    </header>
  )
}

export default Navbar
