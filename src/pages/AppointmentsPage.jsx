import { useEffect, useMemo, useState } from 'react'
import { getBookings } from '../services/firebase'
import { useAppSettings } from '../context/AppSettingsContext'
import * as XLSX from 'xlsx'
import {
  FaArrowLeft,
  FaCalendarDays,
  FaChevronLeft,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
  FaFilter,
  FaMagnifyingGlass,
  FaUsers,
  FaXmark,
} from 'react-icons/fa6'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function AppointmentsPage() {
  const { settings } = useAppSettings()
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState(() => formatDateOnly(new Date()))
  const [searchTerm, setSearchTerm] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const validPin = settings.appointmentsPin || import.meta.env.VITE_APPOINTMENTS_PIN || '1234'

  const handlePinSubmit = (event) => {
    event.preventDefault()
    if (pin.trim() === validPin) {
      setIsAuthenticated(true)
      setPinError('')
      return
    }

    setPinError('Invalid PIN')
  }

  useEffect(() => {
    if (!isAuthenticated) return

    let mounted = true

    const loadBookings = async () => {
      setIsLoading(true)
      setLoadError('')

      try {
        const data = await getBookings()
        if (!mounted) return
        setBookings(data)
      } catch (error) {
        if (!mounted) return
        setLoadError(error.message || 'Failed to load bookings')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadBookings()

    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  const normalizedBookings = useMemo(() => {
    return bookings.map((item) => {
      const rawDate = item.dateAndTime || item.preferredSchedule || item.createdAt
      const parsed = parseAppointmentDate(rawDate)

      return {
        ...item,
        appointmentDate: parsed && !Number.isNaN(parsed.getTime()) ? parsed : null,
        dateKey:
          parsed && !Number.isNaN(parsed.getTime())
            ? formatDateOnly(parsed)
            : null,
      }
    })
  }, [bookings])

  const monthGrid = useMemo(() => {
    const year = monthCursor.getFullYear()
    const month = monthCursor.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    for (let index = 0; index < startOffset; index += 1) {
      cells.push(null)
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day))
    }

    while (cells.length % 7 !== 0) {
      cells.push(null)
    }

    return cells
  }, [monthCursor])

  const bookingsByDate = useMemo(() => {
    return normalizedBookings.reduce((accumulator, item) => {
      if (!item.dateKey) return accumulator
      accumulator[item.dateKey] = (accumulator[item.dateKey] || 0) + 1
      return accumulator
    }, {})
  }, [normalizedBookings])

  const filteredBookings = useMemo(() => {
    return normalizedBookings
      .filter((item) => {
        if (!selectedDay) return true
        return item.dateKey === selectedDay
      })
      .filter((item) => {
        if (companyFilter === 'all') return true
        return (item.company || '').toLowerCase() === companyFilter.toLowerCase()
      })
      .filter((item) => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return true

        const haystack = [
          item.name,
          item.company,
          item.email,
          item.phone,
          item.industry,
          item.message,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(query)
      })
  }, [normalizedBookings, selectedDay, companyFilter, searchTerm])

  const companyOptions = useMemo(() => {
    const companies = Array.from(
      new Set(normalizedBookings.map((item) => (item.company || '').trim()).filter(Boolean)),
    )

    return companies.sort((a, b) => a.localeCompare(b))
  }, [normalizedBookings])

  const selectedDateCount = selectedDay ? bookingsByDate[selectedDay] || 0 : normalizedBookings.length

  const handleExportExcel = () => {
    if (filteredBookings.length === 0) return

    const rows = filteredBookings.map((item) => ({
      Name: item.name || '-',
      Company: item.company || '-',
      Email: item.email || '-',
      Phone: item.phone || '-',
      Industry: item.industry || '-',
      'Date & Time': formatDateTime(item.appointmentDate),
      Message: item.message || '-',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments')

    const exportDate = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `appointments-${exportDate}.xlsx`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
          <form onSubmit={handlePinSubmit} className="card-panel w-full rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-white">Appointments Login</h1>
            <p className="mt-2 text-sm text-slate-300">Enter your PIN to view bookings.</p>

            <div className="mt-5">
              <label htmlFor="pin" className="mb-2 block text-sm font-semibold text-slate-100">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="field-input"
                placeholder="Enter PIN"
              />
              {pinError ? <p className="mt-2 text-xs text-rose-300">{pinError}</p> : null}
            </div>

            <button type="submit" className="btn-primary mt-5 w-full">
              Access Appointments
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/55 p-5 shadow-[0_0_0_1px_rgba(30,41,59,0.2),0_10px_30px_rgba(2,6,23,0.35)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Appointments Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Track schedules, monitor daily volume, and review booking details.
              </p>
            </div>

            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
            >
              <FaArrowLeft className="text-xs" />
              Back to Booking Page
            </a>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Total Appointments</p>
              <p className="mt-1 text-2xl font-semibold text-white">{normalizedBookings.length}</p>
            </div>
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-indigo-200">Selected Date</p>
              <p className="mt-1 text-base font-semibold text-indigo-100">
                {selectedDay ? formatReadableDate(selectedDay) : 'All dates'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Visible Rows</p>
              <p className="mt-1 text-2xl font-semibold text-white">{filteredBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-300">
            {selectedDay
              ? `${selectedDateCount} appointment${selectedDateCount === 1 ? '' : 's'} on selected date`
              : `${normalizedBookings.length} appointment${normalizedBookings.length === 1 ? '' : 's'} overall`}
          </p>
        </div>

        {loadError ? (
          <p className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {loadError}
          </p>
        ) : null}
        {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading appointments...</p> : null}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 shadow-[0_10px_25px_rgba(2,6,23,0.3)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
                <FaCalendarDays />
                Calendar
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                  onClick={() =>
                    setMonthCursor(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                    )
                  }
                >
                  <FaChevronLeft className="text-[10px]" />
                  Prev
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                  onClick={() =>
                    setMonthCursor(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                    )
                  }
                >
                  Next
                  <FaChevronRight className="text-[10px]" />
                </button>
              </div>
            </div>

            <p className="mb-3 text-sm font-semibold text-white">
              {monthCursor.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>

            <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-400">
              {DAYS.map((day) => (
                <p key={day} className="py-1 font-semibold uppercase tracking-wide">
                  {day}
                </p>
              ))}

              {monthGrid.map((cell, index) => {
                if (!cell) {
                  return <div key={`empty-${index}`} className="h-14 rounded-lg border border-transparent" />
                }

                const key = formatDateOnly(cell)
                const count = bookingsByDate[key] || 0
                const isSelected = selectedDay === key
                const hasAppointment = count > 0

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                    className={`relative h-14 rounded-lg border px-2 py-1 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500/25 shadow-[0_0_0_1px_rgba(99,102,241,0.45)]'
                        : hasAppointment
                          ? 'border-indigo-500/45 bg-indigo-500/10 hover:border-indigo-400/70 hover:bg-indigo-500/15'
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {cell.getDate()}
                    </p>
                    <span
                      className={`absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full ${
                        hasAppointment ? 'bg-indigo-300' : 'bg-slate-600'
                      }`}
                    />
                    {hasAppointment ? (
                      <span className="absolute right-1.5 top-1 rounded-full bg-indigo-500/30 px-1.5 py-[1px] text-[10px] font-semibold text-indigo-100">
                        {count}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-2 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-300" />
                Has appointments
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-2 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                No appointments
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 shadow-[0_10px_25px_rgba(2,6,23,0.3)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Appointments Table</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleExportExcel}
                  disabled={filteredBookings.length === 0}
                >
                  <FaDownload className="text-xs" />
                  Export Excel
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/60 bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                  onClick={() => setSelectedDay('')}
                >
                  <FaUsers className="text-xs" />
                  Show All
                </button>
              </div>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div className="relative">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-200" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name, email, phone, industry..."
                  className="field-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>

              <div className="relative">
                <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-200" />
                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-200" />
                <select
                  value={companyFilter}
                  onChange={(event) => setCompanyFilter(event.target.value)}
                  className="field-input appearance-none"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                >
                  <option value="all">All companies</option>
                  {companyOptions.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-left text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="mx-auto max-w-sm space-y-2">
                          <p className="text-base font-semibold text-slate-200">No appointments found</p>
                          <p className="text-sm text-slate-400">
                            Try another date, clear filters, or search using a different keyword.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`text-sm text-slate-200 ${
                          index % 2 === 0 ? 'bg-slate-900/45' : 'bg-slate-900/15'
                        } border-b border-slate-800 last:border-b-0 hover:bg-slate-800/45 cursor-pointer`}
                        onClick={() => setSelectedAppointment(item)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedAppointment(item)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="px-4 py-3 font-semibold text-white">{item.name || '-'}</td>
                        <td className="px-4 py-3">{item.company || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{item.email || '-'}</td>
                        <td className="px-4 py-3">{item.phone || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{item.industry || '-'}</td>
                        <td className="px-4 py-3 font-medium text-indigo-200">
                          {formatDateTime(item.appointmentDate)}
                        </td>
                        <td className="max-w-[260px] px-4 py-3 text-slate-300" title={item.message || '-'}>
                          <span className="block truncate">{item.message || '-'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {selectedAppointment ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm"
            onClick={() => setSelectedAppointment(null)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.6)] sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">Appointment Details</h3>
                  <p className="mt-1 text-sm text-slate-400">Full booking information for selected appointment.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/70 text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                  aria-label="Close modal"
                >
                  <FaXmark />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Name" value={selectedAppointment.name} emphasis />
                <DetailItem label="Company" value={selectedAppointment.company} />
                <DetailItem label="Email" value={selectedAppointment.email} />
                <DetailItem label="Phone" value={selectedAppointment.phone} />
                <DetailItem label="Industry" value={selectedAppointment.industry} />
                <DetailItem label="Date & Time" value={formatDateTime(selectedAppointment.appointmentDate)} emphasis />
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Message</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">{selectedAppointment.message || '-'}</p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="inline-flex items-center rounded-lg border border-indigo-500/60 bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function DetailItem({ label, value, emphasis = false }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className={`mt-1 text-sm ${emphasis ? 'font-semibold text-white' : 'text-slate-200'}`}>
        {value || '-'}
      </p>
    </div>
  )
}

function formatDateOnly(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatReadableDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function parseAppointmentDate(value) {
  if (!value) return null

  // Handle datetime-local values deterministically as local time.
  const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
  if (localDateTimePattern.test(value)) {
    const [datePart, timePart] = value.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)
    return new Date(year, month - 1, day, hour, minute)
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDateTime(date) {
  if (!date) return '-'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default AppointmentsPage
