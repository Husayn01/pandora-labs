import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export function CTASection() {
  return (
    <section className="relative py-24 px-4 bg-[#050505] pb-32">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden h-[400px] md:h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black z-0">
          <img 
            src="/images/dashboard_banner.png" 
            alt="Dive into the future" 
            className="w-full h-full object-cover object-center opacity-70 grayscale mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-thin mb-8 uppercase tracking-tight text-white max-w-2xl"
          >
            Dive Into The <br/>
            <span className="font-medium">Future</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-6"
          >
            <Link to="/signup">
              <Button variant="primary" size="lg" className="uppercase tracking-widest text-xs group">
                Join Pandora
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
