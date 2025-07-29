// components/dashboard/VoiceBookingCard.tsx
'use client'
import { motion } from 'framer-motion';
import { Mic, Headphones } from 'lucide-react';

export const VoiceBookingCard: React.FC = () => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 mb-4 lg:mb-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-white">
        <div className="text-base lg:text-lg font-bold mb-2">VOICE PRACTICE</div>
        <div className="text-sm mb-3">
          Book your AI voice session and improve pronunciation!
        </div>
        <motion.button 
          className="bg-white/20 backdrop-blur-sm px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
          Book Session
        </motion.button>
      </div>
      <div className="absolute right-2 top-2 w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-lg flex items-center justify-center">
        <Headphones className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </div>
    </motion.div>
  );
};
