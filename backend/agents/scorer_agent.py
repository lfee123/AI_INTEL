import json
from state import ResearchState
from agents.utils import get_gemini_json_model
import google.generativeai as genai
import os

def scorer_node(state: ResearchState) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
    # Use temperature 0 for deterministic scoring
    model = genai.GenerativeModel('gemini-2.5-pro', generation_config={"temperature": 0.0, "response_mime_type": "application/json"})
    
    prompt = f"""
    You are the final Investment Scorer.
    Based on all research, score {state['company']} on a scale of 0-100.
    
    Data:
    Market Data: {json.dumps(state['market_data'])}
    Sentiment Score: {state.get('sentiment_score')}
    Red Team Critique: {state.get('red_team_critique')}
    Bull Thesis: {state.get('bull_thesis')[:500]}
    Bear Thesis: {state.get('bear_thesis')[:500]}
    
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
        score = result.get("total_score", 50)
        sub_scores = result.get("sub_scores", {})
        verdict = result.get("verdict", "HOLD")
    except Exception as e:
        score = 50
        sub_scores = {"fundamentals": 10, "sentiment": 10, "momentum": 10, "valuation": 10, "risk": 10}
        verdict = "HOLD"
        
    stream_msg = json.dumps({"agent": "scorer", "score": score, "verdict": verdict, "sub_scores": sub_scores})
    
    return {
        "investment_score": score,
        "sub_scores": sub_scores,
        "verdict": verdict,
        "stream_updates": [stream_msg]
    }
