/**
 * Operations Page (Placeholder)
 * ──────────────────────────────
 * Will show operational workflows, task queues, and agent logs.
 * TODO: Connect to n8n execution logs and Supabase realtime.
 */

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { GlassCard, PandoraOrb } from '@/components/ui';

export default function OperationsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Operations</h1>
        <p className="text-sm text-void-300">
          Monitor and manage your automated workflows.
        </p>
      </motion.div>

      {/* Placeholder content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard hover={false} className="text-center py-16">
          <PandoraOrb size="md" className="mx-auto mb-6" />
          <div className="w-12 h-12 rounded-xl bg-pandora-500/10 border border-pandora-500/20 flex items-center justify-center mx-auto mb-4">
            <Activity size={24} className="text-pandora-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-void-300 max-w-md mx-auto">
            Operations dashboard is being built. Soon you'll be able to monitor all agent 
            workflows, view task queues, and see real-time execution logs.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
