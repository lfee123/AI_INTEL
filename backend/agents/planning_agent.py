import asyncio
import json
import httpx
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

async def search_ticker_yf(query: str) -> str:
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                quotes = data.get("quotes", [])
                for q in quotes:
                    if q.get("quoteType") == "EQUITY":
                        return q.get("symbol")
                if quotes:
                    return quotes[0].get("symbol")
        except Exception:
            pass
    return None

async def planning_node(state: ResearchState) -> dict:
    company = state["company"]
    
    # 1. Resolve ticker using YF Search first, then fallback to Gemini
    ticker = await search_ticker_yf(company)
    
    if not ticker:
        model = get_gemini_json_model()
        prompt = (
            f"Identify the primary, valid NYSE or NASDAQ stock ticker symbol for the company '{company}'. "
            "Return a JSON object with a single key 'ticker' containing the valid symbol (e.g., 'TSLA' for Tesla, NOT 'TESL'). "
            "It must be the exact symbol used for trading on major US exchanges. "
            "If the company is private, index-only, or unknown, return 'UNKNOWN'."
        )
        try:
            response = model.generate_content(prompt)
            text = response.text
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                text = json_match.group(0)
            result = json.loads(text.strip())
            ticker = result.get("ticker", "UNKNOWN")
        except Exception:
            ticker = "UNKNOWN"
            
    if not ticker or ticker == "UNKNOWN":
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
