import os
import asyncio
import httpx
import yfinance as yf
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def fetch_with_retry(client: httpx.AsyncClient, url: str, params: dict = None, retries: int = 1):
    for attempt in range(retries):
        try:
            response = await client.get(url, params=params, timeout=5.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {url}: {e}")
            if attempt == retries - 1:
                return None
            await asyncio.sleep(1)

async def get_yahoo_finance_data(ticker: str) -> dict:
    loop = asyncio.get_event_loop()
    def _fetch():
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            return {
                "current_price": info.get("currentPrice"),
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE"),
                "forward_pe": info.get("forwardPE"),
                "eps": info.get("trailingEps"),
                "52_week_high": info.get("fiftyTwoWeekHigh"),
                "52_week_low": info.get("fiftyTwoWeekLow"),
                "revenue": info.get("totalRevenue"),
                "debt_to_equity": info.get("debtToEquity"),
                "dividend_yield": info.get("dividendYield")
            }
        except Exception as e:
            logger.error(f"Error fetching YF data for {ticker}: {e}")
            return {}
    return await loop.run_in_executor(None, _fetch)

async def get_alpha_vantage_data(ticker: str) -> dict:
    key = os.environ.get("ALPHA_VANTAGE_KEY")
    if not key:
        logger.warning("ALPHA_VANTAGE_KEY missing.")
        return {}
    
    async with httpx.AsyncClient() as client:
        # Just fetching income statement as a proxy for AV data here
        data = await fetch_with_retry(client, "https://www.alphavantage.co/query", {
            "function": "INCOME_STATEMENT",
            "symbol": ticker,
            "apikey": key
        })
        return data if data else {}

async def get_news_api_data(company: str) -> list[str]:
    key = os.environ.get("NEWS_API_KEY")
    if not key:
        logger.warning("NEWS_API_KEY missing.")
        return []
    
    one_month_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    async with httpx.AsyncClient() as client:
        data = await fetch_with_retry(client, "https://newsapi.org/v2/everything", {
            "q": company,
            "from": one_month_ago,
            "sortBy": "relevancy",
            "apiKey": key,
            "language": "en"
        })
        if data and "articles" in data:
            return [article.get("title", "") for article in data["articles"][:20]]
        return []

async def get_sec_edgar_data(ticker: str) -> str:
    start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
    url = f"https://efts.sec.gov/LATEST/search-index?q=\"{ticker}\"&dateRange=custom&startdt={start_date}"
    async with httpx.AsyncClient() as client:
        try:
            # Note: EDGAR requires a user-agent
            headers = {"User-Agent": "AlphaIntel/1.0 (test@example.com)"}
            response = await client.get(url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                hits = data.get("hits", {}).get("hits", [])
                excerpts = []
                for hit in hits[:5]:
                    source = hit.get("_source", {})
                    if "10-K" in source.get("form", "") or "10-Q" in source.get("form", ""):
                        excerpts.append(str(hit))
                return "\n".join(excerpts)
        except Exception as e:
            logger.warning(f"Error fetching SEC data: {e}")
    return ""

async def get_fmp_data(ticker: str) -> dict:
    key = os.environ.get("FMP_KEY")
    if not key:
        logger.warning("FMP_KEY missing.")
        return {}
    
    async with httpx.AsyncClient() as client:
        profile_url = f"https://financialmodelingprep.com/api/v3/profile/{ticker}?apikey={key}"
        rating_url = f"https://financialmodelingprep.com/api/v3/rating/{ticker}?apikey={key}"
        
        profile_data = await fetch_with_retry(client, profile_url)
        rating_data = await fetch_with_retry(client, rating_url)
        
        return {
            "profile": profile_data[0] if profile_data else {},
            "rating": rating_data[0] if rating_data else {}
        }

async def get_gdelt_tone(company: str) -> float:
    # GDELT exact tone logic can be complex to query via standard API easily for a company, 
    # using a simplified mock or search approach if actual API doesn't support direct tone.
    # We will use the GDELT DOC API for tone.
    async with httpx.AsyncClient() as client:
        url = "https://api.gdeltproject.org/api/v2/doc/doc"
        params = {
            "query": company,
            "mode": "tonechart",
            "format": "json",
            "timespan": "60d"
        }
        data = await fetch_with_retry(client, url, params)
        if data and "tonechart" in data:
            # Calculate average tone
            tones = data["tonechart"]
            if tones:
                return sum([float(t.get("bin", 0)) * float(t.get("count", 0)) for t in tones]) / max(sum([float(t.get("count", 0)) for t in tones]), 1)
    return 0.0
