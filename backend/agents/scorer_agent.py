import json
from state import ResearchState
import logging
from agents.utils import GroqAdapter

logger = logging.getLogger(__name__)

def scorer_node(state: ResearchState) -> dict:
    model = GroqAdapter(is_json=True, max_tokens=512)
    
    prompt = f"""
    You are the final Investment Scorer.
    Based on all research, score {state['company']} on a scale of 0-100.
    
    Data:
    Market Data: {json.dumps(state['market_data'])}
    Sentiment Score: {state.get('sentiment_score')}
    Red Team Critique: {state.get('red_team_critique')}
    Bull Thesis: {state.get('bull_thesis')[:2000]}
    Bear Thesis: {state.get('bear_thesis')[:2000]}
    
    Compute 5 sub-scores:
    - Fundamentals (max 25 pts)
    - Sentiment (max 20 pts)
    - Momentum (max 20 pts)
    - Valuation (max 20 pts)
    - Risk (max 15 pts) (inverted: fewer risks = higher score)
    
    Total score = sum of sub-scores.
    Verdict: 70-100 = INVEST, 45-69 = HOLD, 0-44 = PASS.
    
    Return EXACTLY this JSON:
    {{
        "total_score": <int>,
        "sub_scores": {{
            "fundamentals": <int>,
            "sentiment": <int>,
            "momentum": <int>,
            "valuation": <int>,
            "risk": <int>
        }},
        "verdict": "<INVEST|HOLD|PASS>"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        raw_sub = result.get("sub_scores", {})
        
        # Safely extract and cap sub-scores to prevent 8B model hallucinations
        sub_scores = {
            "fundamentals": min(25, max(0, int(raw_sub.get("fundamentals", 0)))),
            "sentiment": min(20, max(0, int(raw_sub.get("sentiment", 0)))),
            "momentum": min(20, max(0, int(raw_sub.get("momentum", 0)))),
            "valuation": min(20, max(0, int(raw_sub.get("valuation", 0)))),
            "risk": min(15, max(0, int(raw_sub.get("risk", 0))))
        }
        
        score = sum(sub_scores.values())
        verdict = result.get("verdict", "HOLD")
    except Exception as e:
        logger.error(f"Scorer failed to parse JSON: {e}. Raw response: {response.text if 'response' in locals() else 'no response'}")
        sub_scores = {"fundamentals": 10, "sentiment": 10, "momentum": 10, "valuation": 10, "risk": 10}
        score = 50
        verdict = "HOLD"
        
    stream_msg = json.dumps({
        "type": "agent_complete",
        "agent": "scorer", 
        "score": score, 
        "verdict": verdict, 
        "sub_scores": sub_scores,
        "data": {
            "score": score,
            "verdict": verdict,
            "sub_scores": sub_scores
        }
    })
    
    return {
        "investment_score": score,
        "sub_scores": sub_scores,
        "verdict": verdict,
        "stream_updates": [stream_msg]
    }
