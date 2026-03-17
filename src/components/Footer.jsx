import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

const contacts = [
  { company: 'Klassic Holdings', phone: '+234 801 000 1101' },
  { company: 'Klassic Energy', phone: '+234 801 000 1102' },
  { company: 'Klassic Logistics', phone: '+234 801 000 1103' },
  { company: 'Klassic Retail', phone: '+234 801 000 1104' },
  { company: 'Klassic Health', phone: '+234 801 000 1105' },
  { company: 'Klassic Agritech', phone: '+234 801 000 1106' },
  { company: 'Klassic Foods', phone: '+234 801 000 1107' },
  { company: 'Klassic Finance', phone: '+234 801 000 1108' },
  { company: 'Klassic Properties', phone: '+234 801 000 1109' },
  { company: 'Klassic Manufacturing', phone: '+234 801 000 1110' },
]

const socials = [
  { label: 'Facebook', icon: FaFacebookF, href: '#' },
  { label: 'Instagram', icon: FaInstagram, href: '#' },
  { label: 'X', icon: FaXTwitter, href: '#' },
  { label: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
  { label: 'YouTube', icon: FaYoutube, href: '#' },
]

function Footer() {
  return (
    <footer className="fade-up fade-delay-3 border-t border-slate-800/70 py-14">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold text-white">Contact Directory</h2>
          <p className="mt-2 text-sm text-slate-400">
            Support: support@klassicgroup.com | 14 Klassic Avenue, Lagos, Nigeria
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {contacts.map((item) => (
              <div
                key={item.company}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-200">{item.company}</p>
                <p className="text-sm text-amber-300">{item.phone}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Social Media</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:-translate-y-1 hover:border-amber-400 hover:text-amber-300"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
