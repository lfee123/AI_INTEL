import json
from state import ResearchState
from agents.utils import get_gemini_model

def memo_node(state: ResearchState) -> dict:
    model = get_gemini_model()
    
    prompt = f"""
    Write a highly professional, institutional-grade Investment Memo for {state['company']} ({state['ticker']}).
    Your writing style should mirror that of a senior Research Lead at a major investment bank (e.g., J.P. Morgan, Goldman Sachs).
    
    Inputs:
    - Verdict: {state.get('verdict')}
    - Score: {state.get('investment_score')}/100
    - Bull Thesis: {state.get('bull_thesis')}
    - Bear Thesis: {state.get('bear_thesis')}
    - Comps Analysis: {state.get('comps_analysis')}
    - Filing Insights: {state.get('filing_insights')}
    - Sentiment Score: {state.get('sentiment_score')}
    - Red Team Critique: {state.get('red_team_critique')}
    
    Format Guidelines:
    - Output ONLY clean, semantic HTML. Do not wrap in markdown code blocks like ` ```html `.
    - Use ONLY the following safe tags: <h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>.
    - Avoid using <table> tags (instead, represent financial metrics and score breakdowns as clean, structured lists using <ul> and <li> with <strong> tags, e.g. "<strong>P/E Ratio:</strong> 24.5"). This ensures the memo renders beautifully on screen and prints perfectly to PDF.
    
    Required Sections (use <h1> for main sections, <h2> for sub-sections, and <p>/<ul>/<li> for content):
    1. Executive Summary & Investment Verdict (Highlight the final score and verdict clearly)
    2. Company Overview & Business Model
    3. Detailed Bull Case (Growth catalysts, competitive moat)
    4. Key Downside Risks & Bear Case
    5. Financial Snapshot (Represent the key metrics from the context as bulleted key-value pairs)
    6. Valuation & Peer Comparison
    7. Sentiment & Media Analysis (Including News highlights)
    8. SEC Filing Audit (Management tone, hidden risks)
    9. Red Team Critique & Mitigation Plan
    10. Final Investment Recommendation (Final sign-off)
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
