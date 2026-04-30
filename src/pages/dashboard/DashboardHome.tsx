/**
 * Dashboard Home Page
 * ────────────────────
 * Welcome message, interactive stats cards, and quick actions.
 * Stats are placeholder data — will connect to Supabase realtime later.
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Bot,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard, AnimatedCounter, Button } from '@/components/ui';

/**
 * Placeholder stats data
 * TODO: Replace with real data from Supabase queries
 * Integration point: supabase.from('stats').select('*').eq('user_id', user.id)
 */
const stats = [
  {
    label: 'Messages Handled Today',
    value: 147,
    suffix: '',
    icon: MessageSquare,
    change: '+23%',
    changePositive: true,
    color: 'text-white',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
  },
  {
    label: 'Agents Active',
    value: 3,
    suffix: '',
    icon: Bot,
    change: '2 new',
    changePositive: true,
    color: 'text-gray-300',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
  },
  {
    label: 'Time Saved This Week',
    value: 24,
    suffix: 'hrs',
    icon: Clock,
    change: '+4.5 hrs',
    changePositive: true,
    color: 'text-gray-400',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
  },
  {
    label: 'Revenue Recovered',
    value: 850,
    prefix: '₦',
    suffix: 'K',
    icon: TrendingUp,
    change: '+₦120K',
    changePositive: true,
    color: 'text-gray-500',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
  },
];

/**
 * Recent activity placeholder
 * TODO: Connect to Supabase realtime subscription
 * Integration point: supabase.channel('activity').on('postgres_changes', ...)
 */
const recentActivity = [
  { text: 'Pandora qualified a lead from WhatsApp', time: '2 min ago', type: 'lead' },
  { text: 'Invoice #1024 sent to Greenfield Ltd.', time: '15 min ago', type: 'invoice' },
  { text: 'Meeting booked with Ada — Tomorrow 2:00 PM', time: '1 hr ago', type: 'calendar' },
  { text: 'Follow-up message sent to 3 prospects', time: '3 hrs ago', type: 'followup' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardHome() {
  const { user } = useAuth();

  // Extract first name from email or user metadata
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Founder';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
              Welcome back, <span className="font-light">{firstName}</span>
            </h1>
            <p className="text-sm text-gray-400 font-light">
              Here's what Pandora has been doing for you.
            </p>
          </div>

          <Link to="/dashboard/agents">
            <Button variant="primary" size="md" className="group">
              <Plus size={16} />
              Create New Agent
              <Sparkles size={14} className="text-gray-400 group-hover:text-black group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <GlassCard className="group relative overflow-hidden">
              {/* Background gradient accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-80 transition-opacity`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bgColor} border ${stat.borderColor} mb-3`}>
                  <stat.icon size={20} className={stat.color} />
                </div>

                {/* Value */}
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.label === 'Revenue Recovered' ? '₦' : ''}
                    suffix={stat.suffix ? ` ${stat.suffix}` : ''}
                    duration={1.5}
                  />
                </div>

                {/* Label */}
                <p className="text-xs text-void-300 mb-2">{stat.label}</p>

                {/* Change indicator */}
                <div className={`inline-flex items-center gap-1 text-xs font-medium ${stat.changePositive ? 'text-glow-400' : 'text-red-400'}`}>
                  <ArrowUpRight size={12} />
                  {stat.change}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard hover={false} className="h-full bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white tracking-tight">Recent Activity</h2>
              <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase border border-white/10 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  {/* Activity dot */}
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors shrink-0" />
                  <div className="flex-1 min-w-0 border-b border-white/5 pb-4 group-last:border-0 group-last:pb-0">
                    <p className="text-sm text-gray-300 font-light">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <button className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer">
                View all activity →
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard hover={false} className="h-full bg-[#0a0a0a]">
            <h2 className="text-lg font-medium text-white mb-6 tracking-tight">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/dashboard/agents">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/20 hover:bg-[#151515] transition-all duration-200 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-gray-300 transition-colors">
                      Create Support Agent
                    </p>
                    <p className="text-xs text-gray-500 font-light mt-0.5">Deploy a branded AI assistant</p>
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/20 hover:bg-[#151515] transition-all duration-200 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-gray-300 transition-colors">
                    Send Voice Command
                  </p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">Talk to Pandora via WhatsApp</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/20 hover:bg-[#151515] transition-all duration-200 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-gray-300 transition-colors">
                    View Insights
                  </p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">See your weekly performance</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
