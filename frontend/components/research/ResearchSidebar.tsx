import ScoreDial from './ScoreDial';
import VerdictBadge from './VerdictBadge';
import SubScoreBars from './SubScoreBars';
import { ScoreData, AgentType } from '../../lib/types';
import { Download, Plus } from 'lucide-react';
import { usePdfDownload } from '../../hooks/usePdfDownload';

interface ResearchSidebarProps {
  companySlug: string;
  resolvedCompany: { name: string; ticker: string } | null;
  scoreData: ScoreData | null;
  isComplete: boolean;
  agents: Record<AgentType, { status: string }>;
}

export default function ResearchSidebar({ 
  companySlug, 
  resolvedCompany, 
  scoreData, 
  isComplete,
  agents
}: ResearchSidebarProps) {
  const { downloadPdf, isDownloading } = usePdfDownload();
  const memoComplete = agents.memo?.status === 'complete';

  return (
    <aside className="w-full md:w-[280px] shrink-0 border-r border-border bg-base p-6 flex flex-col h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-1 truncate">
          {resolvedCompany?.name || decodeURIComponent(companySlug)}
        </h2>
        <div className="flex items-center gap-2">
          {resolvedCompany?.ticker && (
            <span className="font-mono text-sm px-1.5 py-0.5 bg-surface border border-border rounded text-text-secondary">
              {resolvedCompany.ticker}
            </span>
          )}
          {isComplete && (
            <span className="text-[11px] text-[#10B981] font-bold uppercase tracking-widest">
              Analysis Complete
            </span>
          )}
        </div>
      </div>

      <ScoreDial score={scoreData?.score} />
      
      <div className="flex justify-center mt-4 mb-3">
        <VerdictBadge 
          verdict={scoreData?.verdict} 
          isComplete={isComplete} 
        />
      </div>

      <SubScoreBars scores={scoreData?.sub_scores} />

      <div className="mt-auto pt-8 flex flex-col gap-3">
        <button
          onClick={() => downloadPdf(companySlug)}
          disabled={!memoComplete || isDownloading}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all
            ${memoComplete && !isDownloading
              ? 'bg-accent hover:bg-accent/90 text-white active:scale-95' 
              : 'bg-surface border border-border text-text-muted cursor-not-allowed'}
          `}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download Memo PDF'}
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-transparent hover:bg-surface text-text-secondary hover:text-text-primary font-medium text-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Add to Tournament
        </button>
      </div>
    </aside>
  );
}
