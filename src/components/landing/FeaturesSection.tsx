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
    title: 'Live Voice & Transcription',
    description:
      'Speak your commands in English, Hausa, Igbo, or Yoruba. Watch Pandora transcribe and process your voice in real-time.',
  },
  {
    icon: Shield,
    title: 'The Router Agent',
    description:
      'A permanent, un-editable core orchestrator. It listens to your intent and automatically delegates tasks to the right specialist agent.',
  },
  {
    icon: Brain,
    title: 'Curated Agent Store',
    description:
      'Stop building from scratch. Browse and install pre-built, production-ready AI agents for specific tasks with a single click.',
  },
  {
    icon: CalendarCheck,
    title: 'Smart Scheduling',
    description:
      'Install the Appointment Setter agent to book meetings, check availability, and sync directly with your Google Calendar.',
  },
  {
    icon: Receipt,
    title: 'Invoicing & Chasing',
    description:
      'Deploy the Finance agent to generate invoices, send payment links, and chase overdue payments completely autonomously.',
  },
  {
    icon: MessageSquare,
    title: 'Live Task Progress',
    description:
      "Watch your agents work in real-time. See live status updates as they reason, plan, and execute multi-step operations.",
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
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
              Agent <br/><span className="font-medium">Marketplace</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Pandora replaces the ops team you can&apos;t yet afford. Install the exact agents you need from our curated store, and let the Router Agent coordinate them 24/7.
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
