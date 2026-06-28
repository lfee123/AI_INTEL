import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = async (companySlug: string) => {
    setIsDownloading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/memo/${companySlug}`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companySlug}-research-memo.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'An error occurred during download');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPdf, isDownloading, error };
}
