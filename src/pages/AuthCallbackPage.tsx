/**
 * Auth Callback Page
 * ───────────────────
 * Handles OAuth and email confirmation redirects from Supabase.
 * Supabase redirects here with tokens in the URL hash/params.
 * The Supabase client automatically processes the tokens via detectSessionInUrl,
 * then we redirect to the dashboard.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaceholderLogo } from '@/components/ui';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase client auto-detects the tokens from the URL hash
    // via detectSessionInUrl: true in the client config.
    // We just need to wait briefly for the session to be established,
    // then redirect to the dashboard.
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <PlaceholderLogo size={56} className="mx-auto mb-6 animate-pulse" />
        <h2 className="text-xl font-thin text-white mb-2 uppercase tracking-tight">
          Verifying <span className="font-medium">Account</span>
        </h2>
        <p className="text-sm text-gray-500 animate-pulse font-light">
          Setting up your session...
        </p>
      </div>
    </div>
  );
}
