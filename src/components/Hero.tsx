import { Button } from "./ui/button";
import { Music2, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.div
      className="relative pt-16 min-h-screen flex items-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1610254449353-5698372fa83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc2MzM1MTEwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Choir Performance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-indigo/90 to-brand-blue/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <div className="flex items-center gap-2 mb-6">
            <Music2 className="h-8 w-8 text-brand-yellow" />
            <span className="text-brand-yellow/90">SLIIT Official Choir</span>
          </div>
          
          <motion.h1 className="text-white mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
            Voices United in Harmony & Service
          </motion.h1>
          
          <motion.p className="text-white/85 text-xl mb-8 max-w-2xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            We are the official choir of SLIIT, bringing music to life while making a difference 
            through our performances and charitable initiatives.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="bg-white text-brand-navy hover:bg-brand-yellow/10">
              <Heart className="mr-2 h-5 w-5" />
              Support Our Cause
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
              </Button>
            </motion.div>
          </div>

          <motion.div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-brand-yellow/30" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 }}}}>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}>
              <div className="text-white text-3xl mb-2">500+</div>
              <div className="text-brand-yellow/80">Performances</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}>
              <div className="text-white text-3xl mb-2">50+</div>
              <div className="text-brand-yellow/80">Events Annually</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }}}>
              <div className="text-white text-3xl mb-2">10+</div>
              <div className="text-brand-yellow/80">Years of Service</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
