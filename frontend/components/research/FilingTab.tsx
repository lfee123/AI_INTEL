import { FilingData } from '../../lib/types';
import { FileText, AlertTriangle } from 'lucide-react';

interface FilingTabProps {
  data?: FilingData;
}

export default function FilingTab({ data }: FilingTabProps) {
  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <span className="text-text-muted animate-pulse">Waiting for Filing Agent...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent rounded-md text-accent">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-bold tracking-widest">{data.type}</span>
        </div>
        <span className="text-sm text-text-secondary font-mono">{data.date}</span>
      </div>

      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex justify-between items-end mb-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Management Tone</h4>
          <span className="text-xs font-mono text-text-primary">{data.managementTone}/100</span>
        </div>
        <div className="w-full h-2 bg-base rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-bear via-hold to-bull" 
            style={{ width: '100%' }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_rgba(255,255,255,1)]" 
            style={{ left: `${data.managementTone}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted uppercase">Cautious</span>
          <span className="text-[10px] text-text-muted uppercase">Confident</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-bear" />
            Key Risks & Red Flags
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.risks.map((risk, i) => (
              <span key={i} className="px-3 py-1 bg-bear/10 border border-bear/30 text-bear text-xs font-medium rounded-full">
                {risk}
              </span>
            ))}
          </div>
          
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Capital Allocation</h4>
            <p className="text-sm text-text-primary bg-surface p-4 rounded-lg border border-border leading-relaxed">
              {data.capitalAllocation}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Key Extracted Quotes</h4>
          <div className="flex flex-col gap-3">
            {data.quotes.map((quote, i) => (
              <blockquote key={i} className="bg-surface border-l-4 border-accent p-4 rounded-r-lg text-sm text-text-primary italic">
                "{quote}"
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
