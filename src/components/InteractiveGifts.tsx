import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart } from "lucide-react";
import { useAppStore } from "../store";
import { BIRTHDAY_CONFIG } from "../data/memories";

export const InteractiveGifts: React.FC = () => {
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Position 3 floating gifts around the screen
  const gifts = [
    { id: 1, top: "20%", left: "85%", message: "You make my heart smile!" },
    { id: 2, top: "70%", left: "10%", message: "I love you more than words can say." },
    { id: 3, top: "80%", left: "80%", message: "You're my greatest adventure." }
  ];

  const handleOpenGift = (id: number, message: string) => {
    if (openedGifts.includes(id)) return;
    setOpenedGifts((prev) => [...prev, id]);
    setActiveMessage(message);
    
    // Auto close message after 4 seconds
    setTimeout(() => {
      setActiveMessage(null);
    }, 4000);
  };

  return (
    <>
      {/* Floating Gifts Layer */}
      <div className="fixed inset-0 pointer-events-none z-[9990]">
        {gifts.map((gift) => {
          const isOpened = openedGifts.includes(gift.id);
          if (isOpened) return null;

          return (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute pointer-events-auto cursor-pointer hover-trigger"
              style={{ top: gift.top, left: gift.left }}
              onClick={() => handleOpenGift(gift.id, gift.message)}
              whileHover={{ scale: 1.2, filter: "brightness(1.5)" }}
              whileTap={{ scale: 0.8 }}
            >
              <div className="relative">
                <Gift className="w-12 h-12 text-pink-400 drop-shadow-[0_0_15px_rgba(255,183,197,0.8)]" />
                <motion.div 
                  className="absolute inset-0 bg-white/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explosion & Message Overlay */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            {/* Confetti / Hearts Burst */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0, 
                  opacity: 1 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 500, 
                  y: (Math.random() - 0.5) * 500, 
                  scale: Math.random() * 2 + 0.5,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                className="absolute"
              >
                {Math.random() > 0.5 ? 
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> : 
                  <div className="w-4 h-4 bg-gold-400 rounded-sm" />
                }
              </motion.div>
            ))}

            {/* Revealed Message */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="bg-cream-100/90 p-8 rounded-2xl shadow-[0_0_50px_rgba(255,183,197,0.5)] border border-pink-300 pointer-events-auto max-w-sm text-center"
            >
              <p className="font-handwritten text-3xl font-bold text-space-purple leading-tight">
                {activeMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
