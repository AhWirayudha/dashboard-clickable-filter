'use client';

import { useIsClient } from '@/hooks/useClientSafe';

export function ClientTimestamp() {
  const isClient = useIsClient();
  
  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isClient) {
    return <span>Ready</span>;
  }

  return <span>{new Date().toLocaleString()}</span>;
}
