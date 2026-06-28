export type AgentType = 
  | 'planner' 
  | 'bull' 
  | 'bear' 
  | 'news' 
  | 'comps' 
  | 'filing' 
  | 'critic' 
  | 'scorer' 
  | 'reflection' 
  | 'memo';

export type EventType = 'agent_update' | 'agent_complete' | 'error' | 'complete';

export interface SSEEvent {
  type: EventType;
  agent?: AgentType;
  status?: string;
  content?: string;
  data?: any;
}

export interface SubScores {
  fundamentals: number;
  sentiment: number;
  momentum: number;
  valuation: number;
  risk: number;
}

export interface ScoreData {
  score: number;
  verdict: 'INVEST' | 'HOLD' | 'PASS';
  sub_scores: SubScores;
}

export interface NewsData {
  sentiment_score: number;
  top_positive: Array<{ title: string; source: string; date: string; score: number }>;
  top_negative: Array<{ title: string; source: string; date: string; score: number }>;
}

export interface CompsData {
  peers: Array<{
    company: string;
    ticker: string;
    marketCap: string;
    pe: number;
    revenueGrowth: number;
    profitMargin: number;
    debtEquity: number;
    analystRating: string;
  }>;
  analysis: string;
}

export interface FilingData {
  type: string;
  date: string;
  managementTone: number; // 0 (Cautious) to 100 (Confident)
  risks: string[];
  quotes: string[];
  capitalAllocation: string;
}

export interface CriticData {
  critique: string;
  flags: Array<{ id: string; description: string }>;
}

export interface TournamentRequest {
  companies: string[];
}

export interface TournamentMatchup {
  company: string;
  score?: number;
  verdict?: 'INVEST' | 'HOLD' | 'PASS';
}
