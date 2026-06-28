import { CriticData } from '../../lib/types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface RedTeamTabProps {
  data?: CriticData;
  reflectionStatus?: string;
}

export default function RedTeamTab({ data, reflectionStatus }: RedTeamTabProps) {
  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <span className="text-text-muted animate-pulse">Waiting for Critic Agent...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <ShieldAlert className="w-6 h-6 text-hold" />
        <h3 className="text-hold font-bold tracking-widest text-sm uppercase">RED TEAM CRITIQUE</h3>
      </div>

      {reflectionStatus && (
        <div className="w-full bg-accent/10 border border-accent rounded-lg p-4 flex items-center justify-between">
          <span className="text-accent text-sm font-medium">{reflectionStatus}</span>
          <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      <div className="bg-surface p-6 rounded-lg border-l-4 border-l-hold shadow-lg">
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap font-sans">
          {data.critique}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Logical Gaps & Flaws</h4>
        <div className="grid grid-cols-1 gap-3">
          {data.flags.map((flag, i) => (
            <div key={flag.id} className="bg-base border border-border p-4 rounded-lg flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-hold/10 flex items-center justify-center shrink-0 mt-1">
                <AlertTriangle className="w-4 h-4 text-hold" />
              </div>
              <div>
                <span className="text-xs font-mono text-text-secondary mb-1 block">FLAG {flag.id}</span>
                <p className="text-sm text-text-primary leading-relaxed">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
