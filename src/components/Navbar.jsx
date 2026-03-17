import logo from '../assets/KGC_logo.png'

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-20 items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Klassic Group of Companies"
            className="h-12 w-auto object-contain"
          />
          <span className="hidden text-sm font-medium tracking-wide text-slate-200 sm:block">
            Klassic Group of Companies
          </span>
        </a>

        <a
          href="#booking"
          className="rounded-full border border-amber-400/45 bg-amber-500/15 px-5 py-2 text-sm font-semibold text-amber-300 transition hover:border-amber-300 hover:bg-amber-400/20 hover:text-amber-200"
        >
          Schedule Now
        </a>
      </nav>
    </header>
  )
}

export default Navbar
