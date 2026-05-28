import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Calendar } from "lucide-react";
import { BIRTHDAY_CONFIG, type PolaroidPhoto } from "../data/memories";

export const MemoriesGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(null);

  // Framer Motion entry configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 50,
        damping: 15
      }
    }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-cosmic-black via-space-purple/20 to-cosmic-black overflow-hidden" id="memories-section">
      {/* Aesthetic glowing background spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-gold-400 font-sans font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-glow-gold"
          >
            Chapter I
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-cream-100 mt-3 text-glow-pink"
          >
            Our Shared Universe
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mt-4"
          />
        </div>

        {/* Masonry Polaroid Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          {BIRTHDAY_CONFIG.memoriesPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              className="break-inside-avoid inline-block w-full"
            >
              <div 
                onClick={() => setSelectedPhoto(photo)}
                style={{ rotate: `${photo.rotation}deg` }}
                className="polaroid-frame hover-trigger group cursor-none w-full border border-black/5"
              >
                {/* Image element with vintage styling */}
                <div className="polaroid-img-container rounded-sm">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                  />
                  {/* Glowing inner shadow overlay on hover */}
                  <div className="absolute inset-0 bg-pink-300/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                </div>

                {/* Sparkling floating stars on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
                </div>

                {/* Handwritten captions & dates */}
                <p className="font-handwritten text-xl font-bold mt-4 leading-snug text-space-purple">
                  {photo.caption}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <Calendar className="w-3 h-3 text-pink-400" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                    {photo.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fullscreen Dreamy Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 w-full h-full z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close trigger button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-cream-100 transition-all hover:scale-115 active:scale-90 flex items-center justify-center cursor-none z-50 hover-trigger"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Content Card */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative max-w-2xl w-full bg-cream-100 text-space-purple p-5 rounded-md shadow-[0_20px_50px_rgba(255,183,197,0.15)] flex flex-col justify-center items-center select-none"
              onClick={(e) => e.stopPropagation()} // Prevent clicking modal card from closing
            >
              {/* Massive photo frame */}
              <div className="w-full overflow-hidden rounded border border-black/5 bg-neutral-200 relative aspect-[4/3] sm:aspect-video">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, rgba(0,0,0,0.2) 100%) pointer-events-none" />
              </div>

              {/* Description captions */}
              <div className="w-full text-left mt-5 px-1">
                <p className="font-handwritten text-2xl sm:text-3xl font-bold leading-normal text-space-purple">
                  {selectedPhoto.caption}
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-pink-400 font-semibold text-xs tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-sans uppercase">{selectedPhoto.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
