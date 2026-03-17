import logo from '../assets/KGC_logo.png'

function Navbar() {
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
            Klassic Group of Companies
          </span>
        </a>

        <a
          href="#booking"
          className="rounded-md border border-amber-500/60 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/10"
        >
          Schedule Now
        </a>
      </nav>
    </header>
  )
}

export default Navbar
