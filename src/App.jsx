
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import BookingForm from './components/BookingForm'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import AppointmentsPage from './pages/AppointmentsPage'
import SettingsPage from './pages/SettingsPage'
import { useAppSettings } from './context/AppSettingsContext'

function App() {
  const { settings } = useAppSettings()

  return (
    <div style={{ '--accent-color': settings.accentColor }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function HomePage() {
  const { settings } = useAppSettings()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main className="pb-8">
          <HeroSection />
          <BookingForm />
          {settings.showFeatureSection ? <FeatureSection /> : null}
        </main>
        {settings.showFooter ? <Footer /> : null}
      </div>
    </div>
  )
}

export default App