import { CompsData } from '../../lib/types';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface CompetitorTableProps {
  data?: CompsData;
  targetCompany: string;
}

export default function CompetitorTable({ data, targetCompany }: CompetitorTableProps) {
  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <span className="text-text-muted animate-pulse">Waiting for Comps Agent...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-elevated">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted">Company</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted">Ticker</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Mkt Cap</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-right">P/E</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Rev Growth</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Margin</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-right">D/E</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.peers.map((peer, i) => {
              const isTarget = peer.company.toLowerCase() === targetCompany.toLowerCase();
              return (
                <tr 
                  key={i} 
                  className={`transition-colors hover:bg-elevated ${isTarget ? 'bg-accent/10 border-l-2 border-l-accent' : ''}`}
                >
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{peer.company}</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-secondary">{peer.ticker}</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{peer.marketCap}</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{peer.pe}</td>
                  <td className={`px-4 py-3 text-sm font-mono text-right ${peer.revenueGrowth > 0 ? 'text-bull' : 'text-bear'}`}>
                    {peer.revenueGrowth > 0 ? '+' : ''}{peer.revenueGrowth}%
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{peer.profitMargin}%</td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">{peer.debtEquity}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                      ${peer.analystRating === 'Buy' || peer.analystRating === 'Strong Buy' ? 'bg-bull/20 text-bull' : 
                        peer.analystRating === 'Hold' ? 'bg-hold/20 text-hold' : 'bg-bear/20 text-bear'}`}>
                      {peer.analystRating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-surface border border-border p-5 rounded-lg">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Comparative Analysis</h4>
        <p className="text-sm text-text-primary leading-relaxed font-sans">{data.analysis}</p>
      </div>
    </div>
  );
}
