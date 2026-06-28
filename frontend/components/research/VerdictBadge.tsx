import { motion, AnimatePresence } from 'framer-motion';

interface VerdictBadgeProps {
  verdict?: 'INVEST' | 'HOLD' | 'PASS';
  isComplete: boolean;
}

export default function VerdictBadge({ verdict, isComplete }: VerdictBadgeProps) {
  if (!isComplete) {
    return (
      <div className="inline-flex w-fit px-6 py-2 mt-2 rounded-lg bg-surface border border-border items-center justify-center">
        <span className="text-sm font-bold tracking-widest text-text-muted animate-pulse">
          ANALYSING...
        </span>
      </div>
    );
  }

  const getStyles = (v?: string) => {
    switch (v) {
      case 'INVEST': return 'bg-bull/10 border-bull text-bull';
      case 'HOLD': return 'bg-hold/10 border-hold text-hold';
      case 'PASS': return 'bg-bear/10 border-bear text-bear';
      default: return 'bg-surface border-border text-text-muted';
    }
  };

  return (
    <AnimatePresence>
      {isComplete && verdict && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`inline-flex w-fit px-8 py-2 mt-2 rounded-lg border-2 items-center justify-center shadow-lg ${getStyles(verdict)}`}
        >
          <span className="text-xl font-black tracking-widest">
            {verdict}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
