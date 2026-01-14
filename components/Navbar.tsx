
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
    currentView: 'home' | 'destinations' | 'blogs' | 'contact' | 'about' | 'cruises';
    onNavigate: (view: 'home' | 'destinations' | 'blogs' | 'contact' | 'about' | 'cruises') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'CN'>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state with Google Translate cookie on mount
  useEffect(() => {
    const checkCookie = () => {
      const value = "; " + document.cookie;
      const parts = value.split("; googtrans=");
      if (parts.length === 2) {
        const cookieVal = parts.pop()?.split(";").shift();
        if (cookieVal && cookieVal.includes('/zh-CN')) {
          setCurrentLang('CN');
        } else {
          setCurrentLang('EN');
        }
      }
    };
    checkCookie();
  }, []);

  const navLinks = [
    { label: 'Home', action: () => onNavigate('home'), isActive: currentView === 'home' },
    { label: 'Destinations', action: () => onNavigate('destinations'), isActive: currentView === 'destinations' },
    { label: 'Cruises', action: () => onNavigate('cruises'), isActive: currentView === 'cruises' },
    { label: 'Blog', action: () => onNavigate('blogs'), isActive: currentView === 'blogs' },
    { label: 'About Us', action: () => onNavigate('about'), isActive: currentView === 'about' },
    { label: 'Contact Us', action: () => onNavigate('contact'), isActive: currentView === 'contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'zh-CN', label: '中文 (Chinese)', short: 'CN' }
  ];

  const handleLanguageChange = (langCode: string) => {
    // 1. Find the Google Translate Select Element
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
        // 2. Set the value
        combo.value = langCode;
        // 3. Dispatch change event to trigger translation
        combo.dispatchEvent(new Event('change'));
    }

    // 4. Update Local State
    setCurrentLang(langCode === 'zh-CN' ? 'CN' : 'EN');
    
    // 5. Close Menus
    setIsLangMenuOpen(false);
    setIsOpen(false);
  };

  // Logic updated: Both Home, Destinations, and Blogs have dark hero images. 
  // Text should be white initially (transparent bg), and dark only when scrolled (white bg).
  // Exception: Contact page might need special handling if it doesn't have a dark hero, but we designed it with one.
  const isDarkText = scrolled;

  return (
    <nav
      className={`fixed w-full z-[60] transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <button onClick={() => onNavigate('home')} className={`text-2xl font-bold tracking-tight ${isDarkText ? 'text-brand-navy' : 'text-white drop-shadow-md'}`}>
            Long Vacation
            <span className="text-brand-green">.</span>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                    onClick={() => { link.action(); window.scrollTo(0,0); }}
                    className={`font-medium transition-colors hover:text-brand-coral ${
                        link.isActive ? 'text-brand-green font-bold' : (isDarkText ? 'text-brand-navy' : 'text-white')
                    }`}
                >
                    {link.label}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Language Dropdown Desktop */}
          <div className="relative" ref={langMenuRef}>
            <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-2 font-semibold border rounded-full pl-3 pr-2 py-1.5 transition-colors ${
                    isDarkText 
                    ? 'border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-brand-navy'
                }`}
            >
                <Globe size={14} />
                <span>{currentLang}</span>
                <ChevronDown size={14} />
            </button>

            {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn z-50 text-brand-navy overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 flex items-center justify-between ${
                                currentLang === lang.short ? 'text-brand-teal bg-brand-teal/5' : 'text-gray-600'
                            }`}
                        >
                            {lang.label}
                            {currentLang === lang.short && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
            {/* Language Toggle Mobile (Trigger) */}
            <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-1 font-bold text-sm ${
                isDarkText ? 'text-brand-navy' : 'text-white'
                }`}
            >
                <Globe size={16} />
                {currentLang}
            </button>

            {/* Hamburger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isDarkText ? 'text-brand-navy' : 'text-white'}`}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* Language Popup Mobile */}
      {isLangMenuOpen && (
        <>
            <div 
                className="fixed inset-0 z-40 bg-black/20 md:hidden" 
                onClick={() => setIsLangMenuOpen(false)}
            ></div>
            <div className="absolute top-16 right-4 z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 md:hidden animate-slideUp">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-between ${
                            currentLang === lang.short ? 'text-brand-teal bg-brand-teal/5' : 'text-brand-navy'
                        }`}
                    >
                        {lang.label}
                        {currentLang === lang.short && <Check size={16} />}
                    </button>
                ))}
            </div>
        </>
      )}

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-6 animate-fadeIn h-screen">
          {navLinks.map((link) => (
            <button
                key={link.label}
                onClick={() => { link.action(); setIsOpen(false); window.scrollTo(0,0); }}
                className="py-4 text-xl font-medium text-brand-navy border-b border-gray-100 last:border-0 hover:text-brand-teal text-left"
            >
                {link.label}
            </button>
          ))}
          
          <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-400 text-sm mb-4 uppercase tracking-wider font-bold">Language</p>
              <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`py-2 px-4 rounded-lg border text-sm font-bold transition-all ${
                            currentLang === lang.short 
                            ? 'bg-brand-navy text-white border-brand-navy' 
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                          {lang.short}
                      </button>
                  ))}
              </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
