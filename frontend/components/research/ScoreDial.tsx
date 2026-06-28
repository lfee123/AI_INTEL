import { motion } from 'framer-motion';

interface ScoreDialProps {
  score?: number;
}

export default function ScoreDial({ score }: ScoreDialProps) {
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Arc goes from left (-220 deg) to right (+40 deg). That's 260 degrees of a full circle.
  // Actually standard SVG arc uses strokeDasharray and strokeDashoffset.
  // We'll use a 270 degree arc for a dial effect. (3/4 of a circle)
  const arcLength = circumference * 0.75;
  const strokeDasharray = `${arcLength} ${circumference - arcLength}`;
  
  // map score (0-100) to offset
  const offset = score !== undefined ? arcLength - (score / 100) * arcLength : arcLength;
  
  const getColor = (s?: number) => {
    if (s === undefined) return '#334155'; // text-muted
    if (s >= 70) return '#10B981'; // INVEST
    if (s >= 45) return '#F59E0B'; // HOLD
    return '#EF4444'; // PASS
  };

  const color = getColor(score);

  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center flex-col">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="transform -rotate-135 absolute top-0 left-0" // -135deg rotation to start from bottom left
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#1E2D45" // border color
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset, stroke: color }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10 mt-4">
        <motion.span 
          className="text-4xl font-black text-text-primary block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score !== undefined ? score : '—'}
        </motion.span>
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block -mt-1">
          OUT OF 100
        </span>
      </div>
    </div>
  );
}
