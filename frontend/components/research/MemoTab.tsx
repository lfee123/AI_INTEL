import { usePdfDownload } from '../../hooks/usePdfDownload';
import { Download } from 'lucide-react';

interface MemoTabProps {
  content?: string;
  companySlug: string;
}

export default function MemoTab({ content, companySlug }: MemoTabProps) {
  const { downloadPdf, isDownloading } = usePdfDownload();

  if (!content) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <span className="text-text-muted animate-pulse">Waiting for Final Memo...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-text-primary font-bold tracking-widest text-sm uppercase">INVESTMENT MEMO</h3>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            Print
          </button>
          <button
            onClick={() => downloadPdf(companySlug)}
            disabled={isDownloading}
            className="px-4 py-2 rounded bg-accent hover:bg-accent/90 text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div 
        className="bg-white rounded-lg p-8 shadow-xl min-h-[800px] text-black prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
