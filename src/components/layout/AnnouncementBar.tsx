'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Truck, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENTS = [
  { text: 'MEGA LUXURY CLEARANCE: Up to 50% Off Today only!', icon: Sparkles },
  { text: 'Free VIP Express Delivery on orders above ₦25,000!', icon: Truck },
  { text: 'Apply code ZOKOLUXURY for ₦5,000 off orders over ₦50,000!', icon: Gift }
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = ANNOUNCEMENTS[index].icon;

  return (
    <div className="w-full bg-[#111111] dark:bg-black text-[#fafafa] py-2 px-4 text-xs font-medium tracking-wide flex justify-center items-center border-b border-zinc-800 relative z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <ActiveIcon className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>{ANNOUNCEMENTS[index].text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
