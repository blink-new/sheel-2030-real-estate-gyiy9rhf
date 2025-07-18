import { useLanguage } from '../../contexts/LanguageContext'

export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ش</span>
              </div>
              <span className="text-xl font-bold">
                {language === 'ar' ? 'شيل' : 'Sheel'}
              </span>
            </div>
            <p className="text-gray-300 max-w-md">
              {language === 'ar' 
                ? 'منصة عقارية متقدمة تساعدك في العثور على العقار المثالي أو نشر إعلانات عقارية بسهولة وفعالية.'
                : 'A modern real estate platform helping you find the perfect property or list your real estate advertisements with ease and efficiency.'
              }
            </p>
            
            {/* Contact Information */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">📞</span>
                <span className="text-sm">+966552714304</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">🐦</span>
                <a href="https://x.com/sheel2030" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  @sheel2030
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="/create" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.create')}
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.dashboard')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'قانوني' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {language === 'ar' ? 'شيل' : 'Sheel'}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}