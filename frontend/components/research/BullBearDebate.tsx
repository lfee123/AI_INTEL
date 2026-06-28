interface BullBearDebateProps {
  bullContent?: string;
  bearContent?: string;
}

export default function BullBearDebate({ bullContent, bearContent }: BullBearDebateProps) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 relative">
      <div className="flex-1 flex flex-col">
        <h3 className="text-bull font-bold tracking-widest text-sm mb-4">▲ BULL CASE</h3>
        <div className="flex-1 bg-surface border-l-2 border-l-bull rounded-r-lg p-6 text-text-primary text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-lg h-[400px] overflow-y-auto">
          {bullContent || (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-text-muted animate-pulse">Waiting for Bull Agent...</span>
            </div>
          )}
        </div>
        {bullContent && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-text-secondary">Confidence</span>
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-bull w-[85%]" />
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-base border border-border items-center justify-center z-10 shadow-xl">
        <span className="text-xs font-bold text-text-muted">VS</span>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-bear font-bold tracking-widest text-sm mb-4">▼ BEAR CASE</h3>
        <div className="flex-1 bg-surface border-l-2 border-l-bear rounded-r-lg p-6 text-text-primary text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-lg h-[400px] overflow-y-auto">
          {bearContent || (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-text-muted animate-pulse">Waiting for Bear Agent...</span>
            </div>
          )}
        </div>
        {bearContent && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-text-secondary">Confidence</span>
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-bear w-[72%]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
