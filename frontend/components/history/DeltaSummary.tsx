import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DeltaSummaryProps {
  currentPoint: {
    date: string;
    score: number;
    verdict: string;
    keyThesis: string;
  };
  previousPoint?: {
    date: string;
    score: number;
    verdict: string;
    keyThesis: string;
  };
  aiDeltaText: string;
}

export default function DeltaSummary({ currentPoint, previousPoint, aiDeltaText }: DeltaSummaryProps) {
  const scoreDiff = previousPoint ? currentPoint.score - previousPoint.score : 0;

  return (
    <div className="w-full bg-surface border border-border rounded-xl p-6 md:p-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side: Score & Thesis */}
        <div className="flex-1 w-full">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">Selected Analysis</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 p-4 bg-base border border-border rounded-lg">
              <span className="text-xs text-text-secondary block mb-1">{currentPoint.date}</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black font-mono">{currentPoint.score}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1
                  ${currentPoint.verdict === 'INVEST' ? 'bg-bull/10 text-bull' :
                    currentPoint.verdict === 'HOLD' ? 'bg-hold/10 text-hold' :
                    'bg-bear/10 text-bear'}
                `}>
                  {currentPoint.verdict}
                </span>
              </div>
            </div>

            {previousPoint && (
              <>
                <div className="hidden md:flex flex-col items-center">
                  <span className="text-xs text-text-muted mb-1">Delta</span>
                  {scoreDiff > 0 ? (
                    <div className="flex items-center gap-1 text-bull font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{scoreDiff}</span>
                    </div>
                  ) : scoreDiff < 0 ? (
                    <div className="flex items-center gap-1 text-bear font-bold">
                      <TrendingDown className="w-4 h-4" />
                      <span>{scoreDiff}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-text-muted font-bold">
                      <Minus className="w-4 h-4" />
                      <span>0</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Key Thesis</h4>
            <p className="text-sm text-text-primary leading-relaxed bg-base p-4 rounded-lg border border-border">
              {currentPoint.keyThesis}
            </p>
          </div>
        </div>

        {/* Right Side: AI Delta Summary */}
        <div className="flex-1 w-full">
          <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
            AI Delta Analysis
          </h3>
          <div className="bg-accent/5 border border-accent/20 p-6 rounded-lg h-full text-sm text-text-primary leading-relaxed font-sans shadow-inner">
            {aiDeltaText ? (
              // Splitting to highlight changes (green/red) based on simple markup if any, else raw text
              <div dangerouslySetInnerHTML={{ __html: aiDeltaText }} className="prose prose-invert prose-sm max-w-none" />
            ) : (
              <span className="text-text-muted">No comparative analysis available.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
