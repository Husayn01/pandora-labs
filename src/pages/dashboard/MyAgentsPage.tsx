/**
 * My Agents Page
 * ───────────────
 * Shows installed agents from user_agents joined with agent_catalog.
 * Router Agent is always pinned at top and cannot be uninstalled.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot,
  Brain,
  Headphones,
  Calendar,
  Receipt,
  BarChart3,
  Search,
  Trash2,
  Loader2,
  Store,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { GlassCard, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  Brain, Bot, Headphones, Calendar, Receipt, BarChart3,
};

interface InstalledAgent {
  id: string;
  is_active: boolean;
  messages_handled: number;
  installed_at: string;
  custom_system_prompt: string | null;
  catalog: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    type: string;
    is_default: boolean;
    capabilities: string[];
  };
}

export default function MyAgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<InstalledAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAgents = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_agents')
        .select(`
          id,
          is_active,
          messages_handled,
          installed_at,
          custom_system_prompt,
          catalog:agent_catalog (
            id, slug, name, description, category, icon, type, is_default, capabilities
          )
        `)
        .eq('user_id', user.id)
        .order('installed_at', { ascending: true });

      if (error) throw error;
      // Supabase returns catalog as array for FK joins; map to single object
      const mapped = (data || []).map((item: any) => ({
        ...item,
        catalog: Array.isArray(item.catalog) ? item.catalog[0] : item.catalog,
      }));
      setAgents(mapped);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, [user]);

  const handleUninstall = async (agentId: string) => {
    if (!confirm('Uninstall this agent? Your knowledge files and config will be removed.')) return;
    try {
      const { error } = await supabase.from('user_agents').delete().eq('id', agentId);
      if (error) throw error;
      fetchAgents();
    } catch (err) {
      console.error('Error uninstalling:', err);
      alert('Failed to uninstall agent.');
    }
  };

  // Sort: Router first, then by installed_at
  const sorted = [...agents].sort((a, b) => {
    if (a.catalog?.is_default && !b.catalog?.is_default) return -1;
    if (!a.catalog?.is_default && b.catalog?.is_default) return 1;
    return 0;
  });

  const filtered = sorted.filter(
    (a) =>
      a.catalog?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.catalog?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">My Agents</h1>
          <p className="text-sm text-gray-400 font-light">
            Your active AI agent swarm. {agents.length} agent{agents.length !== 1 ? 's' : ''} installed.
          </p>
        </div>

        <Link to="/dashboard/store">
          <Button variant="primary" size="md" className="group">
            <Store size={16} />
            Get More Agents
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      {agents.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search installed agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#111] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all duration-300"
            />
          </div>
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-white/50" size={32} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((agent, index) => {
            const catalog = agent.catalog;
            if (!catalog) return null;
            const Icon = iconMap[catalog.icon] || Bot;
            const isRouter = catalog.is_default;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <GlassCard className={`group bg-[#0a0a0a] relative flex flex-col h-full ${isRouter ? 'border-white/15' : ''}`}>
                  {/* Uninstall button (not for Router) */}
                  {!isRouter && (
                    <button
                      onClick={() => handleUninstall(agent.id)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Uninstall Agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${isRouter ? 'bg-white/5 border-white/20' : 'bg-[#151515] border-white/10'}`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      isRouter
                        ? 'bg-white/10 text-white border-white/20'
                        : agent.is_active
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                      {isRouter && <Shield size={10} />}
                      <div className={`w-1.5 h-1.5 rounded-full ${agent.is_active ? 'bg-current animate-pulse' : 'bg-gray-600'}`} />
                      {isRouter ? 'Core' : agent.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-gray-300 transition-colors mb-1 pr-6">
                    {catalog.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2 font-light flex-1">
                    {catalog.description}
                  </p>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(catalog.capabilities || []).slice(0, 3).map((cap: string) => (
                      <span key={cap} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/5">
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5 font-light">
                    <span>{agent.messages_handled || 0} messages</span>
                    <span>{new Date(agent.installed_at).toLocaleDateString()}</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty state for non-router agents */}
      {!loading && agents.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <p className="text-sm text-gray-400 mb-4 font-light">
            Only the Router Agent is active. Visit the Agent Store to deploy specialist agents.
          </p>
          <Link to="/dashboard/store">
            <Button variant="outline" size="md">
              <Store size={16} />
              Browse Agent Store
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
