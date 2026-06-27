import json
from state import ResearchState
from agents.utils import get_gemini_model

def memo_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    Write a final Investment Memo for {state['company']} ({state['ticker']}).
    Verdict: {state.get('verdict')}
    Score: {state.get('investment_score')}/100
    
    Bull Thesis: {state.get('bull_thesis')}
    Bear Thesis: {state.get('bear_thesis')}
    Comps Analysis: {state.get('comps_analysis')}
    Filing Insights: {state.get('filing_insights')}
    Sentiment: {state.get('sentiment_score')}
    Red Team Critique: {state.get('red_team_critique')}
    
    Format the output as clean HTML without markdown blocks (` ```html `). Use semantic HTML tags (<h1>, <h2>, <p>, <ul>, <table>).
    Include these sections:
    1. Executive Summary
    2. Company Overview
    3. Investment Thesis (Bull Case)
    4. Key Risks (Bear Case)
    5. Financial Snapshot (table)
    6. Competitive Positioning
    7. News & Sentiment Analysis
    8. SEC Filing Highlights
    9. Investment Score Breakdown (table)
    10. Verdict & Recommendation
    """
    
    try:
        response = model.generate_content(prompt)
        memo = response.text
        # Remove markdown html markers if present
        if memo.startswith("```html"):
            memo = memo[7:]
        if memo.endswith("```"):
            memo = memo[:-3]
    except Exception as e:
        memo = f"<h1>Error generating memo</h1><p>{e}</p>"
        
    stream_msg = json.dumps({"agent": "memo", "status": "Investment memo drafted."})
    
    return {
        "memo": memo.strip(),
        "stream_updates": [stream_msg]
    }
