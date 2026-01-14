
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Plane } from 'lucide-react';

const NewsletterPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeen = sessionStorage.getItem('hasSeenNewsletter');

    if (!hasSeen) {
      // Set timer for 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark as seen immediately so it doesn't show again on refresh/navigation
        sessionStorage.setItem('hasSeenNewsletter', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Close after showing success message briefly
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* Modal Card */}
            <div className="bg-brand-navy w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative pointer-events-auto border border-white/10">
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-teal/20 rounded-full blur-[40px] -translate-x-1/2 translate-y-1/2"></div>

              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10 text-center">
                
                {/* Icon Header */}
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                    <Plane size={32} className="text-brand-navy transform -rotate-45 ml-[-4px] mt-[4px]" />
                </div>

                {!isSubscribed ? (
                  <>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Wait! Don't scroll yet.
                    </h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      Join our inner circle and get a <span className="text-brand-green font-bold">10% discount code</span> instantly sent to your inbox. No spam, just shiok deals.
                    </p>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <input 
                        type="email" 
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-brand-green transition-all font-bold text-center"
                      />
                      <button 
                        type="submit"
                        className="w-full bg-brand-green text-brand-navy font-bold py-4 rounded-xl shadow-lg hover:bg-[#8cc72b] transition-all flex items-center justify-center gap-2 group"
                      >
                        Unlock My Discount
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                    
                    <button 
                      onClick={handleClose}
                      className="mt-6 text-xs text-gray-500 font-bold hover:text-gray-300 transition-colors uppercase tracking-widest"
                    >
                      No thanks, I hate saving money
                    </button>
                  </>
                ) : (
                  <div className="py-8">
                    <h2 className="text-3xl font-bold text-white mb-3">
                      You're in! 🎉
                    </h2>
                    <p className="text-gray-300">
                      Check your inbox. Your discount code is on the way.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
