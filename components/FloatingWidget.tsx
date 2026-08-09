import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWidget: React.FC = () => {
  return (
    <a 
      href="#"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group flex items-center gap-0 hover:gap-2 pr-4 hover:pr-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" className="text-transparent" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWidget;