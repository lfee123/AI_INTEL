import json
from state import ResearchState
from agents.utils import get_gemini_model

def bull_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    You are an expert Wall Street equity research analyst taking a BULLISH perspective.
    Company: {state['company']} ({state['ticker']})
    
    Data Context:
    Market Data: {json.dumps(state['market_data'])}
    Recent News: {json.dumps(state['news_headlines'])}
    Filing Excerpts: {state['filing_text'][:2000]}
    
    Write a structured bull thesis (400-600 words) focusing on:
    - Growth Catalysts
    - Competitive Moat
    - Market Opportunity
    - Earnings Momentum
    
    Reason step-by-step and use specific data points provided.
    """
    
    if state.get("iteration_count", 0) > 0 and state.get("red_team_critique"):
        prompt += f"\nAddress this critique from the red team: {state['red_team_critique']}"
        
    try:
        response = model.generate_content(prompt)
        thesis = response.text
    except Exception as e:
        thesis = f"Error generating bull thesis: {e}"
        
    stream_msg = json.dumps({"agent": "bull", "status": "Building bull case...", "content": thesis})
    
    return {
        "bull_thesis": thesis,
        "stream_updates": [stream_msg]
    }
