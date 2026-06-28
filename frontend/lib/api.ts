import { TournamentRequest } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    return res.ok;
  } catch (error) {
    return false;
  }
}

export async function startTournament(data: TournamentRequest) {
  const res = await fetch(`${API_BASE}/api/tournament`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error('Tournament request failed');
  }
  
  return res.json();
}

export async function getHistory(ticker: string) {
  const res = await fetch(`${API_BASE}/api/history/${ticker}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  
  return res.json();
}
