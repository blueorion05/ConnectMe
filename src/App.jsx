
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import BookingForm from './components/BookingForm'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main className="pb-8">
          <HeroSection />
          <BookingForm />
          <FeatureSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App