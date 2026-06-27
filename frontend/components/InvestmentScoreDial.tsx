import React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface Props {
  score: number;
  verdict: string;
  subScores: Record<string, number>;
}

export default function InvestmentScoreDial({ score, verdict, subScores }: Props) {
  let color = 'text-red-500';
  if (score >= 70) color = 'text-green-500';
  else if (score >= 45) color = 'text-yellow-500';

  const chartData = Object.entries(subScores || {}).map(([key, val]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: val,
    fullMark: 25,
  }));

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-2">AlphaIntel Score</h3>
      
      <div className="relative flex items-center justify-center my-6">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96" cy="96" r="88"
            stroke="currentColor" strokeWidth="12" fill="transparent"
            className="text-gray-800"
          />
          <circle
            cx="96" cy="96" r="88"
            stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
            className={`${color.replace('text-', 'text-')} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-black ${color}`}>{score}</span>
          <span className="text-gray-400 text-sm">/ 100</span>
        </div>
      </div>
      
      <div className={`px-6 py-2 rounded-full font-bold text-lg border-2 uppercase tracking-widest ${
        verdict === 'INVEST' ? 'bg-green-900/30 text-green-400 border-green-500' :
        verdict === 'HOLD' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500' :
        'bg-red-900/30 text-red-400 border-red-500'
      }`}>
        {verdict}
      </div>

      <div className="w-full h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
