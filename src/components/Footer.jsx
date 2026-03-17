import brainsLogo from '../assets/logos/Brainstech Logo Official Color.png'
import connectorLogo from '../assets/logos/Connector Logo PNG.png'
import finestFitLogo from '../assets/logos/Logo(1).png'
import greenOasisLogo from '../assets/logos/Logo 10 New.png'
import hytLogo from '../assets/logos/HYT PNG (1).png'
import klassicMarketingLogo from '../assets/logos/Horizontal Logo.png'
import klassicSolutionsLogo from '../assets/logos/KLASSIC SOLUTIONS LOGO.png'
import luxuriousCleaningLogo from '../assets/logos/Luxurious Cleaning Co. Logo (Horizontal).png'
import westwoodDevelopmentLogo from '../assets/logos/Logo1.png'
import westwoodLawLogo from '../assets/logos/Westwood Law Firm Logo (revised).png'
import { FaBuilding, FaLocationDot, FaPhone } from 'react-icons/fa6'

const directoryLinks = [
  {
    name: 'Brains',
    href: 'https://brains.asia/',
    logo: brainsLogo,
  },
  {
    name: 'Klassic Solutions Inc',
    href: 'https://connectorcore.com/Klassic-Solutions-PH-master/',
    logo: klassicSolutionsLogo,
  },
  {
    name: 'Klassic Marketing Inc',
    href: 'https://connectorcore.com/Klassic-Marketing-Inc-Website-master/',
    logo: klassicMarketingLogo,
  },
  {
    name: 'Westwood Development Corp',
    href: 'https://connectorcore.com/Westwood-Development-Corp-Website-master/',
    logo: westwoodDevelopmentLogo,
  },
  {
    name: 'Westwood Law Firm',
    href: 'https://connectorcore.com/Westwood-Law-Firm-Website-master/',
    logo: westwoodLawLogo,
  },
  {
    name: 'Connector',
    href: 'https://connectorcore.com/Connector-Website-master/',
    logo: connectorLogo,
  },
  {
    name: 'The Green Oasis',
    href: 'https://connectorcore.com/The-Green-Oasis-Website-master/',
    logo: greenOasisLogo,
  },
  {
    name: 'Luxurious Cleaning',
    href: 'https://connectorcore.com/Luxurious-Cleaning-Website-master/',
    logo: luxuriousCleaningLogo,
  },
  {
    name: 'Helping Youth Transcend Foundation Inc.',
    href: 'https://connectorcore.com/HYT-Foundation-Inc-Website-master/',
    logo: hytLogo,
  },
  {
    name: 'The Finest Fit',
    href: 'https://connectorcore.com/The-Finest-Fit-Website-master/',
    logo: finestFitLogo,
  },
]

const contactGroups = [
  {
    label: 'Core Group Line',
    companies: ['Klassic Solutions Inc', 'Westwood Law', 'Westwood Development Corp', 'EBB Tech Corp.'],
    numbers: [
      { text: '09499916910 (SMART)', tel: '+639499916910' },
      { text: '87229244', tel: '87229244' },
    ],
  },
  {
    label: 'Marketing Line',
    companies: [
      'Klassic Marketing Inc',
      'Luxurious',
      'The Finest Fit',
      'Beauty Alley',
      'The Green Oasis',
      'Pest Busters',
      'Morena',
      'Grafeio',
    ],
    numbers: [{ text: '09190024136 (SMART)', tel: '+639190024136' }],
  },
  {
    label: 'Connector Group Line',
    companies: ['Brains', 'Millennium', 'Connector', 'Z Corp'],
    numbers: [
      { text: '09755826830 (TM)', tel: '+639755826830' },
      { text: '09815409835 (TNT)', tel: '+639815409835' },
      { text: '83590648', tel: '83590648' },
    ],
  },
]

const officeAddresses = [
  {
    text: '55 Natividad, San Francisco del Monte, Quezon City, 1105 Metro Manila, Philippines',
    query: '55 Natividad, San Francisco del Monte, Quezon City, 1105 Metro Manila, Philippines',
  },
  {
    text: 'Unit 1004 Atlanta Centre, Annapolis St. San Juan City, Philippines',
    query: 'Unit 1004 Atlanta Centre, Annapolis St. San Juan City, Philippines',
  },
]

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/30 py-10">
      <div className="space-y-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
          <p className="text-sm text-slate-400">Connect with our brands and shared company contact lines.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <FaBuilding className="text-slate-300" />
              Companies / Brands
            </h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {directoryLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-md px-2 py-2 transition hover:bg-slate-800/70"
                >
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="h-7 w-7 rounded bg-white/95 object-contain p-1"
                    loading="lazy"
                  />
                  <span className="text-sm text-slate-100 group-hover:text-white">{item.name}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <FaPhone className="text-slate-300" />
              Contact Numbers
            </h3>
            <div className="mt-4 space-y-4">
              {contactGroups.map((group) => (
                <div key={group.label} className="space-y-2 border-b border-slate-800 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold text-slate-100">{group.label}</p>
                  <p className="text-xs leading-relaxed text-slate-400">{group.companies.join(', ')}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.numbers.map((number) => (
                      <a
                        key={`${group.label}-${number.text}`}
                        href={`tel:${number.tel}`}
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
                      >
                        {number.text}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <FaLocationDot className="text-slate-300" />
              Office Addresses
            </h3>
            <div className="mt-4 space-y-3">
              {officeAddresses.map((address) => (
                <div key={address.text} className="rounded-md border border-slate-800 px-3 py-2">
                  <p className="text-sm leading-relaxed text-slate-300">{address.text}</p>
                  <iframe
                    title={`Google Map - ${address.text}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address.query)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="mt-2 h-36 w-full rounded-md border border-slate-800"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-slate-300 underline decoration-slate-600 underline-offset-4 transition hover:text-white"
                  >
                    Open in Google Maps
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Klassic Group of Companies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
