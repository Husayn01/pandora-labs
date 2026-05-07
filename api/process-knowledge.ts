import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
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
    const { fileId, agentId, userId } = req.body;

    if (!fileId || !agentId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.GEMINI_API_KEY) {
       console.warn('GEMINI_API_KEY is not set. Processing will fail.');
    }

    // 1. Fetch file record from DB
    const { data: fileRecord, error: fetchError } = await supabase
      .from('agent_knowledge_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      throw new Error('File record not found');
    }

    // 2. Download file from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('knowledge_files')
      .download(fileRecord.storage_path);

    if (downloadError || !fileBlob) {
      throw new Error('Failed to download file from storage');
    }

    // 3. Extract text
    let extractedText = '';
    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (fileRecord.file_name.toLowerCase().endsWith('.pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else {
      // Assume text-based file (txt, md, csv)
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      throw new Error('No text extracted from file');
    }

    // 4. Chunk the text (simple chunking by paragraphs or length)
    // For MVP, we split by double newline or chunk by ~1000 characters
    const chunks = extractedText.split(/\n\s*\n/).filter(c => c.trim().length > 50);
    
    // Fallback if chunks are too large
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
      if (chunk.length > 2000) {
        const subChunks = chunk.match(/.{1,1500}/g) || [];
        finalChunks.push(...subChunks);
      } else {
        finalChunks.push(chunk);
      }
    }

    // 5. Generate embeddings and store in DB
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    for (const chunk of finalChunks) {
      try {
        const result = await model.embedContent(chunk);
        const embedding = result.embedding.values;

        // Insert into pgvector
        const { error: insertError } = await supabase
          .from('knowledge_embeddings')
          .insert({
            file_id: fileId,
            user_id: userId,
            content: chunk,
            embedding: embedding
          });

        if (insertError) {
          console.error('Error inserting embedding:', insertError);
        }
      } catch (embErr) {
         console.error('Error generating embedding for chunk:', embErr);
      }
    }

    // 6. Update file status to completed
    await supabase
      .from('agent_knowledge_files')
      .update({ status: 'completed' })
      .eq('id', fileId);

    return res.status(200).json({ success: true, message: 'File processed successfully', chunks: finalChunks.length });
  } catch (error: any) {
    console.error('Error processing knowledge:', error);
    
    // Update status to failed
    if (req.body.fileId) {
       await supabase
        .from('agent_knowledge_files')
        .update({ status: 'failed' })
        .eq('id', req.body.fileId);
    }

    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
