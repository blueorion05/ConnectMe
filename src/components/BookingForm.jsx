import { useMemo, useState } from 'react'
import { sendToGoogleSheets } from '../services/api'
import { addBooking } from '../services/firebase'

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
  industry: '',
  preferredSchedule: '',
  message: '',
}

function BookingForm() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const minDateTime = useMemo(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }, [])

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Name is required.'

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

    if (!formData.preferredSchedule) {
      nextErrors.preferredSchedule = 'Please choose your preferred schedule.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleCancel = () => {
    setFormData(initialFormState)
    setErrors({})
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handleSubmit = async (submissionData) => {
    setSuccessMessage('')
    setErrorMessage('')

    setIsSubmitting(true)

    let firestoreSuccess = false
    let sheetsSuccess = false
    let firestoreErrorMessage = null
    let sheetsErrorMessage = null

    try {
      const payload = {
        ...submissionData,
        dateAndTime: submissionData.preferredSchedule,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      try {
        await addBooking(payload)
        firestoreSuccess = true
      } catch (firestoreError) {
        firestoreErrorMessage = firestoreError?.message || 'Firestore write failed'
        console.error('Firestore save failed:', firestoreError)
      }

      try {
        await sendToGoogleSheets(payload)
        sheetsSuccess = true
      } catch (sheetsError) {
        sheetsErrorMessage = sheetsError?.message || 'Google Sheets request failed'
        console.error('Google Sheets submit failed:', sheetsError)
      }

      if (firestoreSuccess || sheetsSuccess) {
        setSuccessMessage('Booking submitted successfully!')
        setFormData(initialFormState)
      } else {
        setErrorMessage('Something went wrong')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    await handleSubmit(formData)
  }

  return (
    <section id="booking" className="scroll-mt-24 py-14">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Book an Appointment</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          This appointment form is for general use. Share your preferred schedule and we will contact you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card-panel rounded-xl p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
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
            placeholder="Your company name"
            error={errors.company}
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
          <SelectField
            id="industry"
            label="Industry"
            value={formData.industry}
            onChange={(e) => updateField('industry', e.target.value)}
            options={industries}
            placeholder="Select industry"
            error={errors.industry}
          />
          <Field
            id="preferredSchedule"
            type="datetime-local"
            label="Preffered Schedule"
            value={formData.preferredSchedule}
            min={minDateTime}
            onChange={(e) => updateField('preferredSchedule', e.target.value)}
            error={errors.preferredSchedule}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-100">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Write any details that will help us prepare for your appointment."
            className="field-input"
          />
        </div>

        {successMessage ? <p className="mt-4 rounded-md bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p> : null}

        {errorMessage ? <p className="mt-4 rounded-md bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</p> : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
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
  min,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} className="field-input" />
      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}

function SelectField({ id, label, value, onChange, options, placeholder, error }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <select id={id} value={value} onChange={onChange} className="field-input">
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}

export default BookingForm
