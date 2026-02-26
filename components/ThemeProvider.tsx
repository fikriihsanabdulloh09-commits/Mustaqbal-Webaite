'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface Theme {
  colors: Record<string, string>;
  fonts: {
    heading: string;
    body: string;
    headingSizes: Record<string, string>;
    bodySize: string;
  };
}

interface GlobalStyle {
  key: string;
  value: string;
}

interface Branding {
  key: string;
  url: string;
  alt_text?: string;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTheme();
    loadGlobalStyles();
    loadBranding();
  }, []);

  async function loadTheme() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) return;

      const theme: Theme = {
        colors: data.colors || {},
        fonts: data.fonts || {
          heading: 'Poppins',
          body: 'Inter',
          headingSizes: {},
          bodySize: '16px',
        },
      };

      applyTheme(theme);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  async function loadGlobalStyles() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('global_styles')
        .select('key, value');

      if (error || !data) return;

      applyGlobalStyles(data);
    } catch (error) {
      console.error('Error loading global styles:', error);
    }
  }

  async function loadBranding() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_branding')
        .select('key, url, alt_text')
        .eq('is_active', true);

      if (error || !data) return;

      applyBranding(data);
    } catch (error) {
      console.error('Error loading branding:', error);
    }
  }

  function applyTheme(theme: Theme) {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    if (theme.fonts) {
      root.style.setProperty('--font-heading', theme.fonts.heading);
      root.style.setProperty('--font-body', theme.fonts.body);
      root.style.setProperty('--font-body-size', theme.fonts.bodySize);

      if (theme.fonts.headingSizes) {
        Object.entries(theme.fonts.headingSizes).forEach(([key, value]) => {
          root.style.setProperty(`--font-size-${key}`, value);
        });
      }
    }
  }

  function applyGlobalStyles(styles: GlobalStyle[]) {
    const root = document.documentElement;

    styles.forEach(style => {
      root.style.setProperty(style.key, style.value);
    });
  }

  function applyBranding(branding: Branding[]) {
    // Apply favicon
    const favicon = branding.find(b => b.key === 'favicon');
    if (favicon) {
      updateFavicon(favicon.url);
    }

    // Store branding in sessionStorage for Header component to use
    const mainLogo = branding.find(b => b.key === 'main_logo');
    if (mainLogo) {
      sessionStorage.setItem('site_logo', mainLogo.url);
      sessionStorage.setItem('site_logo_alt', mainLogo.alt_text || 'Logo');
    }
  }

  function updateFavicon(url: string) {
    // Remove existing favicon
    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
  }

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
