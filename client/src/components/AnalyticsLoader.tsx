import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SiteSettings {
  googleAnalyticsCode?: string;
  googleSearchConsoleCode?: string;
}

export function AnalyticsLoader() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    if (!settings) return;

    // Insert Google Analytics code
    if (settings.googleAnalyticsCode && settings.googleAnalyticsCode.trim()) {
      const existingAnalytics = document.getElementById('google-analytics-script');
      if (!existingAnalytics) {
        const div = document.createElement('div');
        div.id = 'google-analytics-script';
        div.innerHTML = settings.googleAnalyticsCode;
        
        // Move all script tags to head
        const scripts = div.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
            newScript.async = true;
          }
          if (script.innerHTML) {
            newScript.innerHTML = script.innerHTML;
          }
          document.head.appendChild(newScript);
        });
      }
    }

    // Insert Google Search Console verification meta tag
    if (settings.googleSearchConsoleCode && settings.googleSearchConsoleCode.trim()) {
      const existingMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!existingMeta) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = settings.googleSearchConsoleCode.trim();
        const metaTag = tempDiv.querySelector('meta');
        
        if (metaTag) {
          const content = metaTag.getAttribute('content');
          if (content) {
            const meta = document.createElement('meta');
            meta.name = 'google-site-verification';
            meta.content = content;
            document.head.appendChild(meta);
          }
        }
      }
    }
  }, [settings]);

  return null;
}
