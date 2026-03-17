import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

const contactGroups = [
  {
    companies: [
      'Klassic Solutions Inc',
      'Westwood Law',
      'Westwood Development Corp',
      'EBB Tech Corp.',
    ],
    contact: '09499916910 (SMART) | 87229244',
  },
  {
    companies: [
      'Klassic Marketing Inc',
      'Luxurious, Finest Fit',
      'Beauty Alley',
      'The Green Oasis',
      'Pest Busters',
      'Morena',
      'Grafeio',
    ],
    contact: '09190024136 (SMART)',
  },
  {
    companies: ['Brains', 'Millennium', 'Connector', 'Z Corp'],
    contact: '09755826830 (TM) | 09815409835 (TNT) | 83590648',
  },
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
    <footer className="border-t border-slate-800/80 py-14">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold text-white">Contact Directory</h2>
          <p className="mt-2 text-sm text-slate-300">
            Support: support@klassicgroup.com | 14 Klassic Avenue, Lagos, Nigeria
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-1 xl:grid-cols-3">
            {contactGroups.map((group) => (
              <div key={group.contact} className="card-panel rounded-lg px-4 py-4">
                <ul className="space-y-1">
                  {group.companies.map((company) => (
                    <li key={company} className="text-sm font-medium text-slate-100">
                      {company}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-slate-700 pt-3 text-sm font-semibold text-slate-200">{group.contact}</p>
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition hover:border-slate-500"
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
