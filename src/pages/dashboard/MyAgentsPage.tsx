/**
 * My Agents Page
 * ───────────────
 * Lists user's deployed agents.
 * Includes empty state with illustration and a
 * floating action button to create new agents.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Bot,
  Search,
  X,
  Upload,
  FileText,
  Sparkles,
} from 'lucide-react';
import { GlassCard, Button, Input } from '@/components/ui';

/**
 * Placeholder agents data
 * TODO: Fetch from Supabase: supabase.from('agents').select('*').eq('user_id', user.id)
 */
interface Agent {
  id: string;
  name: string;
  company: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  messagesHandled: number;
  createdAt: string;
}

// Start with empty array to show the empty state. Set to sampleAgents to preview cards.
const sampleAgents: Agent[] = [];

export default function MyAgentsPage() {
  const [agents] = useState<Agent[]>(sampleAgents);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase())
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
            Deploy and manage your AI support assistants.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setShowModal(true)} className="group">
          <Plus size={16} />
          Create New Agent
          <Sparkles size={14} className="text-gray-400 group-hover:text-black group-hover:rotate-12 transition-transform" />
        </Button>
      </motion.div>

      {/* Search (visible when there are agents) */}
      {agents.length > 0 && (
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
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#111] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all duration-300"
            />
          </div>
        </motion.div>
      )}

      {/* Content */}
      {filteredAgents.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center text-center py-20"
        >
          {/* Illustration: Logo with floating icons */}
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot size={40} className="text-white/50" />
            </div>

            {/* Floating satellite icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={16} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <FileText size={16} className="text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          <h2 className="text-xl font-medium text-white mb-2 tracking-tight">
            No agents yet
          </h2>
          <p className="text-sm text-gray-400 max-w-md mb-8 leading-relaxed font-light">
            Create your first AI support assistant. Upload your knowledge base 
            and deploy a branded agent that handles customer queries 24/7.
          </p>

          <Button variant="primary" size="lg" onClick={() => setShowModal(true)} className="group">
            <Plus size={18} />
            Create Your First Agent
            <Sparkles size={16} className="text-gray-400 group-hover:text-black group-hover:rotate-12 transition-transform" />
          </Button>
        </motion.div>
      ) : (
        /* Agent Cards Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard className="group bg-[#0a0a0a]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222] border border-white/10 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-white/10 text-white border border-white/20'
                        : agent.status === 'draft'
                        ? 'bg-white/5 text-gray-400 border border-white/10'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'active' ? 'bg-white animate-pulse' : 'bg-current'
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-gray-300 transition-colors mb-1">
                  {agent.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{agent.company}</p>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 font-light">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5 font-light">
                  <span>{agent.messagesHandled} messages handled</span>
                  <span>{agent.createdAt}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Action Button (mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="md:hidden fixed right-6 bottom-24 w-14 h-14 rounded-full bg-white flex items-center justify-center text-black z-40 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        aria-label="Create new agent"
      >
        <Plus size={24} />
      </motion.button>

      {/* Create Agent Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateAgentModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Create Agent Modal
   ───────────────────────────────────────────── */

function CreateAgentModal({ onClose }: { onClose: () => void }) {
  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [_files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to Supabase and trigger n8n workflow
    // Integration points:
    // 1. supabase.from('agents').insert({ name, company, description, user_id })
    // 2. Upload files to Supabase Storage: supabase.storage.from('knowledge-base').upload(...)
    // 3. Trigger n8n webhook: POST /webhook/create-agent with agent_id and file paths
    // 4. n8n processes files → generates embeddings → stores in pgvector
    console.log('Create agent:', { agentName, companyName, description });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white tracking-tight">Create New Agent</h2>
            <p className="text-xs text-gray-400 font-light">Deploy a branded AI support assistant</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Agent Name"
            placeholder="e.g. Support Bot, Sales Assistant"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
          />

          <Input
            label="Company Name"
            placeholder="e.g. Acme Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          {/* Description / Tone */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-400">
              Description & Tone
            </label>
            <textarea
              placeholder="Describe the agent's personality, tone, and what it should help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-white/30 resize-none text-sm font-light"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-400">
              Knowledge Base Files
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                ${dragActive
                  ? 'border-white bg-white/5'
                  : 'border-white/20 hover:border-white/40 bg-[#111]'
                }`}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.md,.doc,.docx,.csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload size={28} className="mx-auto text-gray-500 mb-3" />
              <p className="text-sm text-gray-300 mb-1 font-light">
                Drag & drop files or <span className="text-white font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-600 font-light">
                PDF, TXT, MD, DOC, CSV — up to 10 MB each
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1 group">
              <Sparkles size={16} className="text-gray-400 group-hover:text-black group-hover:rotate-12 transition-transform" />
              Create Agent
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
