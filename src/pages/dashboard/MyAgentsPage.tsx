/**
 * My Agents Page
 * ───────────────
 * Lists user's deployed agents.
 * Fetches from Supabase and allows creating new agents.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Bot,
  Search,
  X,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  Trash2
} from 'lucide-react';
import { GlassCard, Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Agent {
  id: string;
  name: string;
  company: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  messages_handled: number;
  created_at: string;
}

export default function MyAgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAgents = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [user]);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('agents').delete().eq('id', agentId);
      if (error) throw error;
      fetchAgents();
    } catch (err) {
      console.error('Error deleting agent:', err);
      alert('Failed to delete agent.');
    }
  };

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
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-white/50" size={32} />
        </div>
      ) : filteredAgents.length === 0 ? (
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
              <GlassCard className="group bg-[#0a0a0a] relative">
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Delete Agent"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222] border border-white/10 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      agent.status === 'active' || agent.is_active
                        ? 'bg-white/10 text-white border border-white/20'
                        : agent.status === 'draft'
                        ? 'bg-white/5 text-gray-400 border border-white/10'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'active' || agent.is_active ? 'bg-white animate-pulse' : 'bg-current'
                      }`}
                    />
                    {agent.is_active ? 'active' : (agent.status || 'draft')}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-gray-300 transition-colors mb-1 pr-6">
                  {agent.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{agent.company || 'No company'}</p>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 font-light">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5 font-light">
                  <span>{agent.messages_handled || 0} messages handled</span>
                  <span>{new Date(agent.created_at).toLocaleDateString()}</span>
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
          <CreateAgentModal 
            onClose={() => setShowModal(false)} 
            onSuccess={fetchAgents} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Create Agent Modal
   ───────────────────────────────────────────── */

function CreateAgentModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { user } = useAuth();
  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agentType, setAgentType] = useState('support');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Create the Agent in Supabase
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: agentName,
          company: companyName,
          type: agentType,
          description: description,
          system_prompt: `You are ${agentName}, representing ${companyName}. ${description}`,
          is_active: true
        })
        .select()
        .single();

      if (agentError) throw agentError;
      const agentId = agentData.id;

      // 2. Upload Files
      for (const file of files) {
        const filePath = `${user.id}/${agentId}/${file.name}`;
        
        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('knowledge_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Insert into agent_knowledge_files
        const { data: fileData, error: fileDbError } = await supabase
          .from('agent_knowledge_files')
          .insert({
            agent_id: agentId,
            user_id: user.id,
            file_name: file.name,
            storage_path: filePath,
            file_type: file.type,
            file_size: file.size,
            status: 'processing'
          })
          .select()
          .single();

        if (fileDbError) throw fileDbError;

        // 3. Trigger backend processing (Embeddings)
        fetch('/api/process-knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId: fileData.id,
            agentId: agentId,
            userId: user.id
          })
        }).catch(err => console.error('Failed to trigger processing API:', err));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating agent:', err);
      setErrorMsg(err.message || 'An error occurred while creating the agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

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

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Agent Name"
            placeholder="e.g. Support Bot, Sales Assistant"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g. Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-400">Agent Type</label>
              <select
                value={agentType}
                onChange={(e) => setAgentType(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
              >
                <option value="support">Customer Support (RAG)</option>
                <option value="appointment">Appointment Setter</option>
                <option value="invoice">Invoicing & Payments</option>
              </select>
            </div>
          </div>

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
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-white/30 resize-none text-sm font-light disabled:opacity-50"
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
              className={`relative border border-dashed rounded-xl p-6 text-center transition-all duration-300 
                ${isSubmitting ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
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
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Upload size={24} className="mx-auto text-gray-500 mb-2" />
              <p className="text-sm text-gray-300 mb-1 font-light">
                Drag & drop files or <span className="text-white font-medium">browse</span>
              </p>
              <p className="text-[10px] text-gray-600 font-light">
                PDF, TXT, MD, DOC, CSV — up to 10 MB each
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 px-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    {!isSubmitting && (
                      <button type="button" onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-400 ml-2">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={isSubmitting} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting || !agentName} className="flex-1 group">
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Creating...</>
              ) : (
                <><Sparkles size={16} className="text-gray-400 group-hover:text-black group-hover:rotate-12 transition-transform" /> Create Agent</>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
