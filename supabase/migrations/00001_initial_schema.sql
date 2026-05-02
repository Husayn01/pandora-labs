-- Enable pgvector extension
create extension if not exists vector;

-- 1. Agents Table
create table if not exists public.agents (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    company text,
    type text not null, -- 'orchestrator', 'support', 'appointment', 'invoice', 'insights'
    description text,
    system_prompt text,
    is_active boolean default true,
    messages_handled integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Agent Knowledge Files Table
create table if not exists public.agent_knowledge_files (
    id uuid default gen_random_uuid() primary key,
    agent_id uuid references public.agents(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    file_name text not null,
    storage_path text not null,
    file_type text,
    file_size integer,
    status text default 'processing', -- 'processing', 'completed', 'failed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Knowledge Embeddings Table (pgvector)
create table if not exists public.knowledge_embeddings (
    id uuid default gen_random_uuid() primary key,
    file_id uuid references public.agent_knowledge_files(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    embedding vector(768), -- Gemini embeddings are typically 768 dimensions
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for vector similarity search
create index on public.knowledge_embeddings using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. Integrations Table (OAuth tokens, API keys)
create table if not exists public.integrations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    provider text not null, -- 'google_calendar', 'stripe', etc.
    encrypted_tokens text not null, -- Store encrypted!
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, provider)
);

-- 5. Conversations Table
create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    external_channel text not null, -- 'whatsapp', 'web'
    external_user_id text not null, -- e.g., phone number or session ID
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Messages Table
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    agent_id uuid references public.agents(id) on delete set null, -- Optional, if handled by a specific agent
    sender_type text not null, -- 'user', 'agent'
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)

alter table public.agents enable row level security;
alter table public.agent_knowledge_files enable row level security;
alter table public.knowledge_embeddings enable row level security;
alter table public.integrations enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Policies for Agents
create policy "Users can view their own agents" on public.agents for select using (auth.uid() = user_id);
create policy "Users can insert their own agents" on public.agents for insert with check (auth.uid() = user_id);
create policy "Users can update their own agents" on public.agents for update using (auth.uid() = user_id);
create policy "Users can delete their own agents" on public.agents for delete using (auth.uid() = user_id);

-- Policies for Knowledge Files
create policy "Users can view their own files" on public.agent_knowledge_files for select using (auth.uid() = user_id);
create policy "Users can insert their own files" on public.agent_knowledge_files for insert with check (auth.uid() = user_id);
create policy "Users can update their own files" on public.agent_knowledge_files for update using (auth.uid() = user_id);
create policy "Users can delete their own files" on public.agent_knowledge_files for delete using (auth.uid() = user_id);

-- Policies for Embeddings
create policy "Users can view their own embeddings" on public.knowledge_embeddings for select using (auth.uid() = user_id);
create policy "Users can insert their own embeddings" on public.knowledge_embeddings for insert with check (auth.uid() = user_id);
create policy "Users can update their own embeddings" on public.knowledge_embeddings for update using (auth.uid() = user_id);
create policy "Users can delete their own embeddings" on public.knowledge_embeddings for delete using (auth.uid() = user_id);

-- Policies for Integrations
create policy "Users can view their own integrations" on public.integrations for select using (auth.uid() = user_id);
create policy "Users can insert their own integrations" on public.integrations for insert with check (auth.uid() = user_id);
create policy "Users can update their own integrations" on public.integrations for update using (auth.uid() = user_id);
create policy "Users can delete their own integrations" on public.integrations for delete using (auth.uid() = user_id);

-- Policies for Conversations
create policy "Users can view their own conversations" on public.conversations for select using (auth.uid() = user_id);
create policy "Users can insert their own conversations" on public.conversations for insert with check (auth.uid() = user_id);
create policy "Users can update their own conversations" on public.conversations for update using (auth.uid() = user_id);
create policy "Users can delete their own conversations" on public.conversations for delete using (auth.uid() = user_id);

-- Policies for Messages
create policy "Users can view messages in their conversations" on public.messages 
    for select using (
        exists (select 1 from public.conversations c where c.id = messages.conversation_id and c.user_id = auth.uid())
    );
create policy "Users can insert messages in their conversations" on public.messages 
    for insert with check (
        exists (select 1 from public.conversations c where c.id = messages.conversation_id and c.user_id = auth.uid())
    );
