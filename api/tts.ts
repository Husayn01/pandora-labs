import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body; // Default to Rachel
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY not configured on server' });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.85,
          style: 0.15,
          use_speaker_boost: true,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs Error:', errorData);
      return res.status(response.status).json({ error: 'Failed to generate speech' });
    }

    // Stream the audio back to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length.toString());
    return res.status(200).send(buffer);

  } catch (error: any) {
    console.error('TTS API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
