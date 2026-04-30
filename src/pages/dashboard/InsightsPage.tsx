/**
 * Insights Page (Placeholder)
 * ────────────────────────────
 * Will show analytics, performance metrics, and AI-generated business insights.
 * TODO: Connect to Supabase analytics views and n8n reporting workflows.
 */

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { GlassCard, PandoraOrb } from '@/components/ui';

export default function InsightsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Insights</h1>
        <p className="text-sm text-void-300">
          AI-powered analytics and performance reports.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard hover={false} className="text-center py-16">
          <PandoraOrb size="md" className="mx-auto mb-6" />
          <div className="w-12 h-12 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} className="text-neon-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-void-300 max-w-md mx-auto">
            The Insights dashboard will provide real-time analytics, weekly reports, 
            and AI-generated recommendations to optimize your operations.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
