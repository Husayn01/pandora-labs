import { motion } from 'framer-motion';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 px-4 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-tight uppercase max-w-3xl">
            Limitless <span className="font-medium">Possibilities</span><br />
            With Pandora
          </h2>
        </motion.div>

        {/* Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column - Navigation/Steps */}
          <div className="lg:w-1/4 flex flex-col gap-8">
            <div className="flex flex-col gap-6 border-l border-white/10 pl-6">
              <div className="text-white font-medium cursor-pointer text-sm tracking-wide">01 / INSTALL AGENTS</div>
              <div className="text-gray-600 hover:text-gray-300 transition-colors cursor-pointer text-sm tracking-wide">02 / VOICE COMMANDS</div>
              <div className="text-gray-600 hover:text-gray-300 transition-colors cursor-pointer text-sm tracking-wide">03 / ROUTER EXECUTION</div>
            </div>
          </div>

          {/* Right Column - Image & Text */}
          <div className="lg:w-3/4 flex flex-col md:flex-row gap-10 items-center bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 relative h-64 md:h-80 rounded-2xl overflow-hidden"
            >
              <img 
                src="/images/section_character.png" 
                alt="Pandora AI"
                className="absolute inset-0 w-full h-full object-cover object-center mix-blend-lighten grayscale opacity-90"
              />
            </motion.div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:pr-8 py-6">
              <h3 className="text-2xl font-medium text-white mb-4 leading-snug">
                How The Swarm Operates
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                First, install specialized AI agents from the Store. Then, simply tap the mic and speak your command. 
                The core Router Agent understands your intent, delegates to the right specialist, and shows you 
                live progress as tasks are executed.
              </p>
              <div>
                <a href="#" className="text-xs uppercase tracking-widest text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                  Learn More
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
