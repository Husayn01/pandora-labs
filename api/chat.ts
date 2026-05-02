import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for local development with Vite
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Missing message or userId' });
    }

    // TODO:
    // 1. Fetch user's active agents from Supabase
    // 2. Pass message and agents to Gemini Router
    // 3. Router decides which agent to call
    // 4. Specialist agent executes and returns response
    
    // Placeholder response
    const reply = `[Pandora Web Chat] Received: "${message}". The Router Agent is being implemented!`;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
