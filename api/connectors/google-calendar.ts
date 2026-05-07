import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Use VERCEL_URL (auto-set by Vercel) or SITE_URL env var for redirect
function getRedirectUri(req: VercelRequest): string {
  if (process.env.SITE_URL) return `${process.env.SITE_URL}/api/connectors/google-calendar`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/connectors/google-calendar`;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5173';
  return `${proto}://${host}/api/connectors/google-calendar`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action, userId, code, state } = req.query;

  // Guard: OAuth credentials must be configured
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    const msg = 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your Vercel environment variables.';
    if (action === 'authorize') return res.status(500).send(`<html><body style="font-family:sans-serif;padding:2rem;background:#000;color:#fff"><h2>⚠️ Configuration Error</h2><p>${msg}</p></body></html>`);
    return res.status(500).json({ error: msg });
  }

  const REDIRECT_URI = getRedirectUri(req);

  // 1. Authorize — redirect user to Google consent screen
  if (action === 'authorize') {
    if (!userId) return res.status(400).send('Missing userId');

    const scope = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' ');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', Array.isArray(userId) ? userId[0] : userId);

    return res.redirect(authUrl.toString());
  }

  // 2. Callback — exchange auth code for tokens
  if (code && state) {
    const userIdFromState = Array.isArray(state) ? state[0] : state;

    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: Array.isArray(code) ? code[0] : code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const data = await tokenRes.json();
      if (data.error) throw new Error(data.error_description || data.error);

      await supabase.from('user_connectors').upsert({
        user_id: userIdFromState,
        provider: 'google_calendar',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_expiry: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        scopes: ['https://www.googleapis.com/auth/calendar'],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,provider' });

      return res.redirect('/dashboard/store?connected=google_calendar');
    } catch (err: any) {
      console.error('Google Calendar OAuth error:', err);
      return res.redirect(`/dashboard/store?error=${encodeURIComponent(err.message)}`);
    }
  }

  return res.status(400).send('Invalid request — missing action or callback params');
}
