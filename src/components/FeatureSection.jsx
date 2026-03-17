const features = [
  {
    title: 'Schedule Meetings',
    description:
      'Let clients lock in consultations with your team in a structured and reliable flow.',
  },
  {
    title: 'Product Inquiries',
    description:
      'Capture interest, service requests, and purchase intent in one intelligent intake form.',
  },
  {
    title: 'Centralized Booking',
    description:
      'Route all submissions into one source of truth so every company can coordinate faster.',
  },
]

function FeatureSection() {
  return (
    <section className="py-14">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Why Teams Choose Klassic</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Built for modern businesses that need speed, control, and premium customer experience.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="card-panel rounded-xl p-6 transition hover:border-slate-600"
          >
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
