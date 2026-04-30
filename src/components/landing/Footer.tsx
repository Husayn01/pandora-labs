/**
 * Footer Component
 * ─────────────────
 * Simple, clean footer with branding and links.
 */

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-pandora-500/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pandora-400 to-pandora-700" />
                <div className="absolute inset-[30%] rounded-full bg-pandora-200/40 blur-[1px]" />
              </div>
              <span className="text-lg font-bold text-white">
                Pandora<span className="text-pandora-400"> Labs</span>
              </span>
            </Link>
            <p className="text-sm text-void-300 max-w-sm leading-relaxed">
              The AI-powered ops assistant for early-stage startups. 
              Automate everything from lead qualification to invoicing.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-pandora-300 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-void-300 hover:text-pandora-300 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-void-300 hover:text-pandora-300 transition-colors">How It Works</a></li>
              <li><Link to="/signup" className="text-sm text-void-300 hover:text-pandora-300 transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-pandora-300 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-void-300">About</span></li>
              <li><span className="text-sm text-void-300">Privacy</span></li>
              <li><span className="text-sm text-void-300">Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-pandora-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-void-400">
            © {new Date().getFullYear()} Pandora Labs. All rights reserved.
          </p>
          <p className="text-xs text-void-400">
            Built with 💜 for founders who move fast.
          </p>
        </div>
      </div>
    </footer>
  );
}
