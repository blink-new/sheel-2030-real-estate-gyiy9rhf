import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WhatsAppFloat from './components/ui/whatsapp-float'
import HomePage from './pages/HomePage'
import CreateListingPage from './pages/CreateListingPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateListingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <Toaster position="top-right" />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App