import { useState, useEffect, useCallback } from 'react';

export type AgentUpdate = {
  type: string;
  agent: string;
  status?: string;
  content?: string;
  data?: any;
  sentiment_score?: number;
  top_positive?: string[];
  top_negative?: string[];
  peers?: string[];
  analysis?: string;
  summary?: string;
  critique?: string;
  flags?: number;
  score?: number;
  verdict?: string;
  sub_scores?: Record<string, number>;
  state?: any;
};

export function useResearchStream() {
  const [updates, setUpdates] = useState<AgentUpdate[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalState, setFinalState] = useState<any | null>(null);

  const startResearch = useCallback((company: string) => {
    setUpdates([]);
    setIsStreaming(true);
    setError(null);
    setFinalState(null);

    fetch('http://localhost:8000/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company })
    })
      .then(async (response) => {
        if (!response.body) throw new Error('ReadableStream not yet supported in this browser.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          let eventEndIndex;
          while ((eventEndIndex = buffer.indexOf('\n\n')) >= 0) {
            const eventStr = buffer.slice(0, eventEndIndex);
            buffer = buffer.slice(eventEndIndex + 2);
            
            const lines = eventStr.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const dataStr = line.substring(6);
                  if (!dataStr.trim()) continue;
                  
                  const parsed: AgentUpdate = JSON.parse(dataStr);
                  
                  if (parsed.type === 'complete') {
                    setFinalState(parsed.state);
                    setIsStreaming(false);
                  } else if (parsed.type === 'error') {
                    setError(parsed.status || 'Unknown error');
                    setIsStreaming(false);
                  } else {
                    setUpdates((prev) => [...prev, parsed]);
                  }
                } catch (e) {
                  console.error('Error parsing SSE json', e);
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsStreaming(false);
      });
  }, []);

  return { updates, startResearch, isStreaming, error, finalState };
}
