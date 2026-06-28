import json
from state import ResearchState
from agents.utils import get_gemini_json_model

def red_team_node(state: ResearchState) -> dict:
    model = get_gemini_json_model()
    
    bull_thesis = state.get('bull_thesis') or "No bull thesis provided."
    bear_thesis = state.get('bear_thesis') or "No bear thesis provided."
    filing_insights = state.get('filing_insights') or ""
    sentiment_score = state.get('sentiment_score')
    if sentiment_score is None:
        sentiment_score = 0.0
        
    prompt = f"""
    You are an elite, highly skeptical Red Team Critic for an institutional investment committee.
    Your job is to mercilessly stress-test the Bull and Bear theses and identify logical gaps, unaddressed risks, cognitive biases, or weak assumptions.
    
    Company: {state.get('company')}
    
    Inputs to Review:
    - BULL THESIS:
    {bull_thesis}
    
    - BEAR THESIS:
    {bear_thesis}
    
    - SEC FILING INSIGHTS:
    {filing_insights[:1000]}
    
    - SENTIMENT SCORE: {sentiment_score}
    
    Task:
    Provide a professional, objective, and sharp critique (approx. 250-300 words). Challenge:
    - Confirmation bias / cherry-picked data.
    - Missing context or macro assumptions.
    - Over-reliance on management's optimistic guidance.
    
    Count the number of severe unaddressed risk factors or major logical flaws (integer).
    
    Return EXACTLY this JSON structure:
    {{
        "critique": "Your detailed critique text...",
        "flags": 3
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        
        # Robust JSON parsing
        import re
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group(0)
            
        result = json.loads(text.strip())
        critique = result.get("critique", "")
        flags = result.get("flags", 0)
    except Exception as e:
        critique = f"Error generating critique or parsing response: {e}. Raw response: {response.text if 'response' in locals() else 'None'}"
        flags = 1
        
    stream_msg = json.dumps({"agent": "critic", "critique": critique, "flags": flags})
    
    return {
        "red_team_critique": json.dumps({"critique": critique, "flags": flags}),
        "stream_updates": [stream_msg]
    }
