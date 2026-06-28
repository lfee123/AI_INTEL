import { useState, useEffect, useCallback, useRef } from 'react';
import { AgentType, SSEEvent, ScoreData, NewsData, CompsData, FilingData, CriticData } from '../lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AgentState {
  status: 'idle' | 'active' | 'complete' | 'error';
  content?: string;
  data?: any;
  error?: string;
  completionTimeMs?: number;
}

type AgentsState = Record<AgentType, AgentState>;

const initialAgentsState: AgentsState = {
  planner: { status: 'idle' },
  bull: { status: 'idle', content: '' },
  bear: { status: 'idle', content: '' },
  news: { status: 'idle' },
  comps: { status: 'idle' },
  filing: { status: 'idle' },
  critic: { status: 'idle' },
  scorer: { status: 'idle' },
  reflection: { status: 'idle' },
  memo: { status: 'idle' }
};

export function useResearchStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentsState>(initialAgentsState);
  
  // Data specifically extracted for UI
  const [resolvedCompany, setResolvedCompany] = useState<{ name: string; ticker: string } | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [compsData, setCompsData] = useState<CompsData | null>(null);
  const [filingData, setFilingData] = useState<FilingData | null>(null);
  const [criticData, setCriticData] = useState<CriticData | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const agentStartTimes = useRef<Partial<Record<AgentType, number>>>({});

  const startStream = useCallback((company: string) => {
    // Reset state
    setAgents(JSON.parse(JSON.stringify(initialAgentsState)));
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);
    setResolvedCompany(null);
    setScoreData(null);
    setNewsData(null);
    setCompsData(null);
    setFilingData(null);
    setCriticData(null);
    agentStartTimes.current = {};

    // In a real implementation with POST, EventSource doesn't support POST natively.
    // However, the prompt says: "POST to /api/research with { company } -> Backend returns SSE stream"
    // Usually this is done via standard fetch that returns a ReadableStream, or EventSource with a GET.
    // If we MUST use POST for SSE, we'll use fetch and parse the stream manually.
    // Given the prompt says `EventSource`, it might imply a GET or we have to use fetch.
    // Let's implement the standard fetch stream reading since standard EventSource only does GET.
    
    const fetchStream = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/research`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({ company }),
        });

        if (!response.ok) {
          throw new Error(`Failed to start research: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error('No readable stream available');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep the incomplete part

          for (const chunk of lines) {
            // Handle multi-line SSE chunks (event: + data: on separate lines)
            const dataLine = chunk
              .split('\n')
              .find(l => l.startsWith('data: '));
            
            if (!dataLine) continue;
            
            const dataStr = dataLine.substring(6).trim();
            if (dataStr === '[DONE]') {
              setIsStreaming(false);
              setIsComplete(true);
              continue;
            }

            try {
              const event: SSEEvent = JSON.parse(dataStr);
              handleEvent(event);
            } catch (e) {
              console.error('Failed to parse SSE JSON', e, dataStr);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Stream connection failed');
        setIsStreaming(false);
      }
    };

    fetchStream();
    
  }, []);

  const handleEvent = useCallback((event: SSEEvent) => {
    setAgents(prev => {
      const next = { ...prev };
      
      if (event.type === 'complete') {
        setIsStreaming(false);
        setIsComplete(true);
        // Ensure all active nodes are marked complete
        Object.keys(next).forEach(key => {
          if (next[key as AgentType].status === 'active') {
            next[key as AgentType].status = 'complete';
          }
        });
        return next;
      }

      if (event.type === 'error' && event.agent) {
        next[event.agent] = {
          ...next[event.agent],
          status: 'error',
          error: event.content || 'An error occurred',
        };
        setError(`Agent ${event.agent} failed: ${event.content}`);
        return next;
      }

      if (event.agent) {
        const agent = event.agent;
        
        if (event.type === 'agent_update') {
          if (next[agent].status !== 'active') {
             agentStartTimes.current[agent] = Date.now();
          }
          next[agent] = {
            ...next[agent],
            status: 'active',
          };
          
          // Stream content for bull/bear
          if (event.content && (agent === 'bull' || agent === 'bear')) {
            next[agent].content = (next[agent].content || '') + event.content;
          }
        } else if (event.type === 'agent_complete') {
           const duration = agentStartTimes.current[agent] ? Date.now() - agentStartTimes.current[agent]! : 0;
           next[agent] = {
             ...next[agent],
             status: 'complete',
             completionTimeMs: duration
           };
           
           if (event.content && (agent === 'bull' || agent === 'bear' || agent === 'memo')) {
             // For bull/bear, the full content might be sent on complete, or we just keep what streamed.
             // If event.content is provided, overwrite or use it. We will overwrite just in case.
             next[agent].content = event.content;
           }

           if (event.data) {
             next[agent].data = event.data;
             // Update specific state for UI
             if (agent === 'planner') {
               setResolvedCompany(event.data);
             } else if (agent === 'scorer') {
               setScoreData(event.data);
             } else if (agent === 'news') {
               setNewsData(event.data);
             } else if (agent === 'comps') {
               setCompsData(event.data);
             } else if (agent === 'filing') {
               setFilingData(event.data);
             } else if (agent === 'critic') {
               setCriticData(event.data);
             }
           }
        }
      }
      
      return next;
    });
  }, []);

  return {
    startStream,
    isStreaming,
    isComplete,
    error,
    agents,
    resolvedCompany,
    scoreData,
    newsData,
    compsData,
    filingData,
    criticData
  };
}
