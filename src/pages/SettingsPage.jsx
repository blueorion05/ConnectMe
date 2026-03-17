import { useState } from 'react'
import { useAppSettings } from '../context/AppSettingsContext'

function SettingsPage() {
  const {
    settings,
    updateSetting,
    resetSettings,
    saveSettings,
    discardUnsavedChanges,
    isSettingsLoading,
    settingsSyncError,
    isSavingSettings,
    hasUnsavedChanges,
  } = useAppSettings()
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const validPin = settings.settingsPin || '9999'

  const handlePinSubmit = (event) => {
    event.preventDefault()
    if (pin.trim() === validPin) {
      setIsAuthenticated(true)
      setPinError('')
      return
    }

    setPinError('Invalid PIN')
  }

  if (isSettingsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
          <div className="card-panel w-full rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="mt-2 text-sm text-slate-300">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
          <form onSubmit={handlePinSubmit} className="card-panel w-full rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-white">Settings Login</h1>
            <p className="mt-2 text-sm text-slate-300">Enter settings PIN to continue.</p>

            <div className="mt-5">
              <label htmlFor="settings-pin" className="mb-2 block text-sm font-semibold text-slate-100">
                PIN
              </label>
              <input
                id="settings-pin"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="field-input"
                placeholder="Enter PIN"
              />
              {pinError ? <p className="mt-2 text-xs text-rose-300">{pinError}</p> : null}
            </div>

            {settingsSyncError ? <p className="mt-3 text-xs text-rose-300">{settingsSyncError}</p> : null}

            <button type="submit" className="btn-primary mt-5 w-full">
              Open Settings
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-white">App Settings</h1>
          <a href="/" className="btn-secondary">
            Back to Booking Page
          </a>
        </div>

        {settingsSyncError ? <p className="mb-4 rounded-md bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{settingsSyncError}</p> : null}
        {isSavingSettings ? <p className="mb-4 text-sm text-slate-300">Saving settings...</p> : null}
        {!isSavingSettings && hasUnsavedChanges ? <p className="mb-4 text-sm text-amber-300">You have unsaved changes.</p> : null}

        <section className="card-panel rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">Branding & Landing Content</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Company Display Name"
              value={settings.brandName}
              onChange={(value) => updateSetting('brandName', value)}
            />
            <Field
              label="Top Badge Text"
              value={settings.heroBadge}
              onChange={(value) => updateSetting('heroBadge', value)}
            />
            <Field
              label="Main Headline"
              value={settings.heroTitle}
              onChange={(value) => updateSetting('heroTitle', value)}
            />
            <Field
              label="Supporting Text"
              value={settings.heroSubtitle}
              onChange={(value) => updateSetting('heroSubtitle', value)}
            />
            <Field
              label="Primary Button Text"
              value={settings.ctaLabel}
              onChange={(value) => updateSetting('ctaLabel', value)}
            />
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-100">Theme Accent Color</label>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(event) => updateSetting('accentColor', event.target.value)}
                className="h-11 w-full cursor-pointer rounded-md border border-slate-600 bg-slate-900 px-2"
              />
            </div>
          </div>
        </section>

        <section className="card-panel mt-6 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">App Experience</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Toggle
              label="Show Highlights Section"
              value={settings.showFeatureSection}
              onChange={(value) => updateSetting('showFeatureSection', value)}
            />
            <Toggle
              label="Show Footer Directory"
              value={settings.showFooter}
              onChange={(value) => updateSetting('showFooter', value)}
            />
            <Field
              label="Support Email"
              value={settings.supportEmail}
              onChange={(value) => updateSetting('supportEmail', value)}
            />
            <Field
              label="Support Address"
              value={settings.supportAddress}
              onChange={(value) => updateSetting('supportAddress', value)}
            />
            <Field
              label="Appointments PIN"
              type="password"
              value={settings.appointmentsPin}
              onChange={(value) => updateSetting('appointmentsPin', value)}
            />
            <Field
              label="Settings PIN"
              type="password"
              value={settings.settingsPin}
              onChange={(value) => updateSetting('settingsPin', value)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={resetSettings}>
              Reset Form to Defaults
            </button>
            <button type="button" className="btn-secondary" onClick={discardUnsavedChanges}>
              Discard Unsaved Changes
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={saveSettings}
              disabled={!hasUnsavedChanges || isSavingSettings}
            >
              {isSavingSettings ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-100">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
      />
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  )
}

export default SettingsPage
