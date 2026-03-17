import { useMemo, useState } from 'react'

const tierOptions = ['Starter', 'Business', 'Custom']
const moduleOptions = ['Accounting', 'Human Resources', 'Inventory', 'Fleet']
const companySizes = ['1-5', '6-50', '51-200', '200+']
const industries = [
  'Technology',
  'Finance',
  'Retail',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Logistics',
  'Agriculture',
  'Hospitality',
  'Other',
]

const initialFormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  tier: 'Business',
  modules: [],
  companySize: '',
  industry: '',
  demoDate: '',
  message: '',
}

function BookingForm() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Name is required.'
    if (!formData.company.trim()) nextErrors.company = 'Company is required.'
    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    if (!formData.tier) nextErrors.tier = 'Please select a tier.'
    if (!formData.companySize) nextErrors.companySize = 'Please select company size.'
    if (!formData.industry) nextErrors.industry = 'Please select an industry.'
    if (!formData.demoDate) nextErrors.demoDate = 'Please select a demo date.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const toggleModule = (moduleName) => {
    setFormData((prev) => {
      const hasModule = prev.modules.includes(moduleName)
      const nextModules = hasModule
        ? prev.modules.filter((item) => item !== moduleName)
        : [...prev.modules, moduleName]

      return { ...prev, modules: nextModules }
    })
  }

  const handleCancel = () => {
    setFormData(initialFormState)
    setErrors({})
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    if (!validate()) return

    if (!scriptUrl) {
      setErrorMessage('Google Sheets endpoint is missing. Set VITE_GOOGLE_SCRIPT_URL in your .env file.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        modules: formData.modules.join(', '),
        submittedAt: new Date().toISOString(),
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking request.')
      }

      setSuccessMessage('Your booking has been submitted!')
      setFormData(initialFormState)
    } catch (error) {
      setErrorMessage(error.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="booking" className="fade-up fade-delay-1 scroll-mt-24 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Book an Appointment</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Schedule a meeting, request a product demo, or send purchase inquiries directly to our team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="name"
            label="Name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="John Doe"
            error={errors.name}
            required
          />
          <Field
            id="company"
            label="Company"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            placeholder="Klassic Retail"
            error={errors.company}
            required
          />
          <Field
            id="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="name@company.com"
            error={errors.email}
            required
          />
          <Field
            id="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+234 800 000 0000"
            error={errors.phone}
            required
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-100">Tier</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {tierOptions.map((option) => {
                const isRecommended = option === 'Business'
                const isSelected = formData.tier === option
                return (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-amber-400/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={option}
                      checked={isSelected}
                      onChange={(e) => updateField('tier', e.target.value)}
                      className="sr-only"
                    />
                    <span>{option}</span>
                    {isRecommended ? (
                      <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                        Recommended
                      </span>
                    ) : null}
                  </label>
                )
              })}
            </div>
            {errors.tier ? <p className="mt-2 text-xs text-rose-300">{errors.tier}</p> : null}
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-100">Modules</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {moduleOptions.map((moduleName) => (
                <label
                  key={moduleName}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition hover:border-amber-400/50"
                >
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(moduleName)}
                    onChange={() => toggleModule(moduleName)}
                    className="h-4 w-4 rounded border-slate-500 text-amber-500 focus:ring-amber-400"
                  />
                  {moduleName}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SelectField
            id="companySize"
            label="Company Size"
            value={formData.companySize}
            onChange={(e) => updateField('companySize', e.target.value)}
            options={companySizes}
            placeholder="Select company size"
            error={errors.companySize}
            required
          />
          <SelectField
            id="industry"
            label="Industry"
            value={formData.industry}
            onChange={(e) => updateField('industry', e.target.value)}
            options={industries}
            placeholder="Select industry"
            error={errors.industry}
            required
          />
          <Field
            id="demoDate"
            type="date"
            label="Demo Date"
            value={formData.demoDate}
            min={minDate}
            onChange={(e) => updateField('demoDate', e.target.value)}
            error={errors.demoDate}
            required
          />
        </div>

        <div className="mt-5">
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-100">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Tell us about your use case, preferred meeting time, or specific product needs..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400"
          />
        </div>

        {successMessage ? (
          <p className="mt-5 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-lg border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  required = false,
  min,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
        {required ? <span className="ml-1 text-amber-300">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400"
      />
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
        {required ? <span className="ml-1 text-amber-300">*</span> : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}

export default BookingForm
