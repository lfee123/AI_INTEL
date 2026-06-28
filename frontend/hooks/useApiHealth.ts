import { useState, useEffect } from 'react';
import { checkApiHealth } from '../lib/api';

export function useApiHealth(intervalMs = 30000) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const healthy = await checkApiHealth();
      if (mounted) {
        setIsHealthy(healthy);
      }
    }

    // Initial check
    check();

    // Polling
    const intervalId = setInterval(check, intervalMs);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return isHealthy;
}
