import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getAppSettings, saveAppSettings } from '../services/firebase'

export const defaultSettings = {
  brandName: 'Klassic Group of Companies',
  heroBadge: 'General Appointment Booking',
  heroTitle: 'Book with Klassic Group',
  heroSubtitle: 'Empowering Multiple Companies under one ecosystem',
  ctaLabel: 'Schedule Now',
  accentColor: '#f59e0b',
  showFeatureSection: true,
  showFooter: true,
  supportEmail: 'support@klassicgroup.com',
  supportAddress: '14 Klassic Avenue, Lagos, Nigeria',
  appointmentsPin: '1205',
  settingsPin: '0829',
}

const AppSettingsContext = createContext(null)

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [draftSettings, setDraftSettings] = useState(defaultSettings)
  const [isSettingsLoading, setIsSettingsLoading] = useState(true)
  const [settingsSyncError, setSettingsSyncError] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const loadedOnceRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const loadSettings = async () => {
      setIsSettingsLoading(true)
      setSettingsSyncError('')

      try {
        const remoteSettings = await getAppSettings()
        if (!mounted) return

        if (remoteSettings) {
          const merged = { ...defaultSettings, ...remoteSettings }
          setSettings(merged)
          setDraftSettings(merged)
        } else {
          setSettings(defaultSettings)
          setDraftSettings(defaultSettings)
        }

        loadedOnceRef.current = true
      } catch (error) {
        if (!mounted) return
        setSettingsSyncError(error?.message || 'Failed to load settings from Firestore')
        loadedOnceRef.current = true
      } finally {
        if (mounted) setIsSettingsLoading(false)
      }
    }

    loadSettings()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', draftSettings.accentColor)
  }, [draftSettings])

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(draftSettings)

  const saveSettings = async () => {
    if (!loadedOnceRef.current) return
    if (!hasUnsavedChanges) return

    setIsSavingSettings(true)
    setSettingsSyncError('')

    try {
      await saveAppSettings(draftSettings)
      setSettings(draftSettings)
    } catch (error) {
      setSettingsSyncError(error?.message || 'Failed to save settings to Firestore')
    } finally {
      setIsSavingSettings(false)
    }
  }

  const value = useMemo(() => {
    return {
      settings: draftSettings,
      isSettingsLoading,
      settingsSyncError,
      isSavingSettings,
      hasUnsavedChanges,
      updateSetting: (key, value) =>
        setDraftSettings((prev) => ({
          ...prev,
          [key]: value,
        })),
      saveSettings,
      resetSettings: () => setDraftSettings(defaultSettings),
      discardUnsavedChanges: () => setDraftSettings(settings),
    }
  }, [
    draftSettings,
    isSettingsLoading,
    settingsSyncError,
    isSavingSettings,
    hasUnsavedChanges,
    settings,
  ])

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}
