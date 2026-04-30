import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Amara Okafor',
    role: 'Founder, TechBridge Africa',
    content:
      'Pandora handled 200+ customer queries in our first week alone. It felt like hiring a full ops team overnight.',
    avatar: 'AO',
  },
  {
    name: 'Kwame Mensah',
    role: 'CEO, PayFlow NG',
    content:
      'The voice-note workflow is a game-changer. I just tell Pandora what I need while driving and everything is handled by the time I arrive.',
    avatar: 'KM',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'Co-founder, GreenLeaf',
    content:
      'We went from missing 40% of follow-ups to zero. Pandora doesn\'t forget, doesn\'t sleep, and never misses a lead.',
    avatar: 'FA',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-32 px-4 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Curved background line decoration */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 transform -skew-y-3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Section header */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-tight mb-8 uppercase">
              Voices Of The <br/><span className="font-medium">Future</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md font-light">
              Early adopters are already saving hours every day. Discover how Pandora is 
              reshaping operations for startups globally, acting as a seamless extension 
              of their core team.
            </p>
          </motion.div>
        </div>

        {/* Testimonial cards stacked */}
        <div className="lg:w-1/2 flex flex-col gap-4 w-full">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-6 hover:bg-[#151515] hover:border-white/10 transition-colors group"
            >
              <p className="text-sm text-gray-400 leading-relaxed font-light italic flex-1 group-hover:text-gray-300 transition-colors">
                "{testimonial.content}"
              </p>

              <div className="flex flex-col items-center shrink-0 w-32 border-l border-white/5 pl-6">
                <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xs font-medium text-white mb-3">
                  {testimonial.avatar}
                </div>
                <div className="text-xs font-medium text-white text-center">
                  {testimonial.name}
                </div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 text-center">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
