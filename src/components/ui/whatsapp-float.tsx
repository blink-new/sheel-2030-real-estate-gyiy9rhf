import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  const phoneNumber = '+966552714304'
  const message = encodeURIComponent('Hello! I found your real estate platform and I\'m interested in learning more.')
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="relative">
        {/* Animated pulse rings */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50"></div>
        
        {/* Main WhatsApp button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group-hover:shadow-xl">
          <MessageCircle className="h-6 w-6" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Chat with us on WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </a>
  )
}