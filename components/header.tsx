/**
 * Header Component
 * Main site header with navigation and theme toggle
 */

'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site.config';
import { ThemeToggle } from './theme-toggle';
import { Moon, Sun, X } from 'lucide-react';

export function Header() {
  const [activeSite, setActiveSite] = useState<'telegram' | 'discord' | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    // Check if running on localhost or vercel domains to set the active site
    if (hostname.includes('discord')) {
      setActiveSite('discord');
    } else if (hostname.includes('telegram')) {
      setActiveSite('telegram');
    }
  }, []);

  // We use exact pixel measurements and translateY offsets calculated from the internal viewBox 
  // and text baseline coordinates of the two SVGs to ensure the "QuantCopier" text perfectly 
  // aligns in all states (active vs inactive).
  const getTelegramStyles = () => {
    if (activeSite === 'telegram') return { width: '150px', opacity: 1 };
    if (activeSite === 'discord') return { width: '110px', opacity: 0.6 };
    return { width: '130px', opacity: 1 }; // Default / Local
  };

  const getDiscordStyles = () => {
    if (activeSite === 'telegram') return { width: '104px', opacity: 0.6, transform: 'translateY(12px)' };
    if (activeSite === 'discord') return { width: '138px', opacity: 1, transform: 'translateY(2px)' };
    return { width: '120px', opacity: 1, transform: 'translateY(7px)' }; // Default / Local
  };

  return (
    <header>
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-col items-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-0 tracking-tight">
            Release Notes
          </h1>
          
          <div className="flex items-center justify-center gap-4 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <a 
              href="https://qc-telegram-releasenotes.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:scale-105 transition-all duration-300 flex items-center justify-center" 
              title="Go to Telegram Release Notes"
            >
              <img src="/QCT_Logo_Light.svg" alt="QCT Logo" style={getTelegramStyles()} className="h-auto dark:hidden block object-contain transition-all duration-300" />
              <img src="/QCT_Logo_Dark.svg" alt="QCT Logo" style={getTelegramStyles()} className="h-auto hidden dark:block object-contain transition-all duration-300" />
            </a>
            <a 
              href="https://qc-discord-releasenotes.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:scale-105 transition-all duration-300 flex items-center justify-center" 
              title="Go to Discord Release Notes"
            >
              <img src="/QCD_Logo_Light.svg" alt="QCD Logo" style={getDiscordStyles()} className="h-auto dark:hidden block object-contain transition-all duration-300" />
              <img src="/QCD_Logo_Dark.svg" alt="QCD Logo" style={getDiscordStyles()} className="h-auto hidden dark:block object-contain transition-all duration-300" />
            </a>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>
    </header>
  );
}
