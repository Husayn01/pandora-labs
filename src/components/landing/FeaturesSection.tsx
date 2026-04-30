import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  MessageSquare,
  Mic,
  CalendarCheck,
  Receipt,
  Brain,
  Shield,
} from 'lucide-react';
import { GlassCard } from '@/components/ui';

const features = [
  {
    icon: Mic,
    title: 'Voice-First Ops',
    description:
      'Send a WhatsApp voice note and Pandora handles the rest — scheduling, follow-ups, invoicing, all from a quick message.',
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel Support',
    description:
      'Meet your customers wherever they are — WhatsApp, SMS, web chat. One AI, every channel, zero missed conversations.',
  },
  {
    icon: Brain,
    title: 'Agentic AI Swarm',
    description:
      'Not just one bot — a coordinated swarm of specialized agents that reason, plan, and execute complex business tasks autonomously.',
  },
  {
    icon: CalendarCheck,
    title: 'Smart Scheduling',
    description:
      'Pandora books meetings, sends reminders, and reschedules — synced directly with your Google Calendar.',
  },
  {
    icon: Receipt,
    title: 'Invoicing & Chasing',
    description:
      'Generate invoices, send payment links, and chase overdue payments automatically. Never lose revenue to forgotten follow-ups.',
  },
  {
    icon: Shield,
    title: 'Ship Your Own Agent',
    description:
      "Upload your knowledge base and deploy a branded customer support AI for your clients.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-32 px-4 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Section header */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-32"
          >
            <span className="text-gray-500 text-xs font-medium tracking-widest uppercase mb-4 block">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-thin tracking-tight mb-6 uppercase">
              Our <br/><span className="font-medium">Service</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Pandora replaces the ops team you can&apos;t yet afford. One AI that handles 
              six departments, 24/7, seamlessly bridging the physical and digital.
            </p>
          </motion.div>
        </div>

        {/* Feature cards grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <GlassCard className="h-full group relative overflow-hidden bg-[#111] hover:bg-[#151515] transition-colors p-8">
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-8 text-white">
                    <feature.icon size={28} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="mt-auto">
                    <h3 className="text-lg font-medium text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
