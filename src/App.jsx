<<<<<<< HEAD
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import BookingForm from './components/BookingForm'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.14),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.11),transparent_42%),linear-gradient(180deg,#030712_0%,#0b1220_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main>
          <HeroSection />
          <BookingForm />
          <FeatureSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App;