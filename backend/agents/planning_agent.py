import asyncio
import json
from state import ResearchState
from agents.utils import get_gemini_json_model
from data_fetchers import (
    get_yahoo_finance_data,
    get_alpha_vantage_data,
    get_news_api_data,
    get_sec_edgar_data,
    get_fmp_data,
    get_gdelt_tone
)

async def planning_node(state: ResearchState) -> dict:
    company = state["company"]
    
    # 1. Resolve ticker using Gemini or YF
    model = get_gemini_json_model()
    prompt = f"What is the primary stock ticker symbol for the company '{company}'? Return a JSON object with a single key 'ticker' containing the symbol. If private or unknown, return 'UNKNOWN'."
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        ticker = result.get("ticker", company.upper()[:4])
    except Exception as e:
        ticker = company.upper()[:4]
        
    state["ticker"] = ticker
    
    # Send stream update
    stream_msg = json.dumps({"agent": "planner", "status": f"Resolved ticker: {ticker}. Fetching data from 6 sources..."})
    
    # 2. Fetch data in parallel
    results = await asyncio.gather(
        get_yahoo_finance_data(ticker),
        get_alpha_vantage_data(ticker),
        get_news_api_data(company),
        get_sec_edgar_data(ticker),
        get_fmp_data(ticker),
        get_gdelt_tone(company)
    )
    
    market_data = results[0]
    av_data = results[1]
    news_headlines = results[2]
    filing_text = results[3]
    fmp_data = results[4]
    sentiment_score = results[5]
    
    # Combine market data with FMP/AV
    combined_market_data = {
        "yfinance": market_data,
        "alpha_vantage": av_data,
        "fmp": fmp_data
    }
    
    return {
        "ticker": ticker,
        "market_data": combined_market_data,
        "news_headlines": news_headlines,
        "filing_text": filing_text,
        "comps_data": fmp_data,
        "sentiment_score": sentiment_score * 100, # Assuming tone is -1 to 1 or similar
        "stream_updates": [stream_msg]
    }
