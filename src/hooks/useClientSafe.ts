'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches by ensuring components only render on client
 * @returns {boolean} - true when component is mounted on client side
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook for safe client-side operations that may cause hydration mismatches
 * @param callback - Function to execute on client side only
 * @param deps - Dependencies array for useEffect
 * @returns {T | null} - Result of callback or null during SSR
 */
export function useClientSafe<T>(
  callback: () => T,
  deps: React.DependencyList
): T | null {
  const [result, setResult] = useState<T | null>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      setResult(callback());
    }
  }, [isClient, ...deps]);

  return result;
}
