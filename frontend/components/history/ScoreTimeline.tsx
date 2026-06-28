import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts';

interface HistoryPoint {
  date: string;
  score: number;
  verdict: 'INVEST' | 'HOLD' | 'PASS';
  keyThesis: string;
}

interface ScoreTimelineProps {
  data: HistoryPoint[];
  onSelect: (point: HistoryPoint) => void;
  selectedDate?: string;
}

export default function ScoreTimeline({ data, onSelect, selectedDate }: ScoreTimelineProps) {
  const getColor = (verdict: string) => {
    if (verdict === 'INVEST') return '#10B981';
    if (verdict === 'HOLD') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="w-full">
      {/* Visual Timeline (Scrollable) */}
      <div className="flex overflow-x-auto gap-4 py-8 px-4 no-scrollbar border-b border-border mb-8">
        {data.map((point, i) => (
          <button
            key={i}
            onClick={() => onSelect(point)}
            className={`
              min-w-[160px] flex flex-col items-center p-4 rounded-xl transition-all relative group shrink-0
              ${selectedDate === point.date ? 'bg-surface border-accent' : 'bg-transparent border-transparent hover:bg-surface'}
              border-2
            `}
          >
            {selectedDate === point.date && (
              <div className="absolute -top-3 w-6 h-6 bg-accent rotate-45 border-l-2 border-t-2 border-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            )}
            <span className="text-xs font-mono text-text-secondary mb-3">{point.date}</span>
            <div className={`px-3 py-1 rounded text-xs font-bold ${
              point.verdict === 'INVEST' ? 'bg-bull/10 text-bull' :
              point.verdict === 'HOLD' ? 'bg-hold/10 text-hold' :
              'bg-bear/10 text-bear'
            }`}>
              {point.verdict}
            </div>
            <span className="mt-3 text-2xl font-black text-text-primary font-mono">{point.score}</span>
          </button>
        ))}
      </div>

      {/* Recharts Chart */}
      <div className="w-full h-[300px] bg-surface rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">Score History</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#334155" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="#334155" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1421', border: '1px solid #1E2D45', borderRadius: '8px' }}
              itemStyle={{ color: '#F1F5F9' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <svg key={`dot-${payload.date}`} x={cx - 6} y={cy - 6} width={12} height={12} fill={getColor(payload.verdict)} cursor="pointer" onClick={() => onSelect(payload)}>
                    <circle cx="6" cy="6" r="6" />
                  </svg>
                );
              }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#F1F5F9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
