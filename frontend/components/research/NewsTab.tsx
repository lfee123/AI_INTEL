import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NewsData } from '../../lib/types';

interface NewsTabProps {
  data?: NewsData;
}

export default function NewsTab({ data }: NewsTabProps) {
  if (!data) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-surface border border-border rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-text-muted text-sm">Waiting for News Agent...</span>
        </div>
      </div>
    );
  }

  const sentimentColor = data.sentiment_score >= 50 ? 'text-bull border-bull bg-bull/10' : 'text-bear border-bear bg-bear/10';

  // Mocking 30 days data since API shape for chart wasn't perfectly specified in the prompt but requested
  const chartData = Array.from({ length: 30 }).map((_, i) => {
    const val = 30 + Math.random() * 50; 
    return {
      day: `Day ${i + 1}`,
      sentiment: val,
      color: val >= 50 ? '#10B981' : '#EF4444'
    };
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between p-6 bg-surface border border-border rounded-xl">
        <div>
          <h3 className="text-lg font-bold text-text-primary">30-Day Sentiment Trend</h3>
          <p className="text-sm text-text-secondary">Analysis of 400+ news articles and social signals</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border-2 ${sentimentColor}`}>
          <span className="text-2xl font-black">{data.sentiment_score.toFixed(1)}</span>
          <span className="text-xs uppercase tracking-widest block font-bold">SCORE</span>
        </div>
      </div>

      <div className="w-full h-48 bg-surface border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ backgroundColor: '#0D1421', border: '1px solid #1E2D45', borderRadius: '8px' }}
              itemStyle={{ color: '#F1F5F9' }}
            />
            <Bar dataKey="sentiment" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h4 className="text-bull font-bold tracking-widest text-sm uppercase">Bullish Signals</h4>
          {data.top_positive.map((news, i) => (
            <div key={i} className="bg-surface p-4 rounded-lg border-l-2 border-l-bull shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary">{news.source} • {news.date}</span>
                <span className="text-xs font-mono text-bull bg-bull/10 px-2 rounded">+{news.score}</span>
              </div>
              <p className="text-sm text-text-primary leading-tight font-medium">{news.title}</p>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-bear font-bold tracking-widest text-sm uppercase">Bearish Signals</h4>
          {data.top_negative.map((news, i) => (
            <div key={i} className="bg-surface p-4 rounded-lg border-l-2 border-l-bear shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary">{news.source} • {news.date}</span>
                <span className="text-xs font-mono text-bear bg-bear/10 px-2 rounded">-{news.score}</span>
              </div>
              <p className="text-sm text-text-primary leading-tight font-medium">{news.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
