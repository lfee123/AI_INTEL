import { motion } from 'framer-motion';
import { SubScores } from '../../lib/types';

interface SubScoreBarsProps {
  scores?: SubScores;
}

const ITEMS = [
  { key: 'fundamentals', label: 'Fundamentals', max: 25 },
  { key: 'sentiment', label: 'Sentiment', max: 20 },
  { key: 'momentum', label: 'Momentum', max: 20 },
  { key: 'valuation', label: 'Valuation', max: 20 },
  { key: 'risk', label: 'Risk', max: 15 },
] as const;

export default function SubScoreBars({ scores }: SubScoreBarsProps) {
  const getColor = (s: number, max: number) => {
    const pct = s / max;
    if (pct >= 0.75) return 'bg-bull';
    if (pct >= 0.50) return 'bg-hold';
    return 'bg-bear';
  };

  return (
    <div className="w-full mt-6 space-y-4">
      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">
        Sub-scores
      </h4>
      {ITEMS.map(({ key, label, max }) => {
        const val = scores?.[key as keyof SubScores];
        const isLoaded = val !== undefined;
        const displayVal = isLoaded ? val : '-';
        const pct = isLoaded ? (val / max) * 100 : 0;
        
        return (
          <div key={key} className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">{label}</span>
              {isLoaded ? (
                <span className="text-xs font-mono text-text-primary">{displayVal}/{max}</span>
              ) : (
                <div className="w-8 h-4 bg-surface animate-pulse rounded"></div>
              )}
            </div>
            <div className="w-full h-1.5 bg-surface border border-border rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${isLoaded ? getColor(val, max) : 'bg-transparent'}`}
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
