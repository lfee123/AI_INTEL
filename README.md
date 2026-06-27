# AlphaIntel

AlphaIntel is a production-grade AI Investment Research Agent. It takes a company name as input, deploys a multi-agent LangGraph pipeline to research it from every angle, and returns a structured investment decision (INVEST / HOLD / PASS) with a 0–100 score, full reasoning, and a downloadable PDF Investment Memo.

## Architecture

AlphaIntel uses a multi-agent architecture built with LangGraph.
1. **Planning Agent**: Resolves the ticker and fetches data concurrently from Yahoo Finance, Alpha Vantage, NewsAPI, SEC EDGAR, FMP, and GDELT.
2. **Data Processors**: 
   - **News Sentiment Agent**: Classifies news headlines and computes a sentiment score.
   - **Comps Agent**: Compares the company to its peers using FMP data.
   - **Filing Agent**: Extracts key risks, guidance, and tone from SEC 10-K/10-Q excerpts.
3. **Thesis Writers**:
   - **Bull Agent**: Constructs a bullish thesis.
   - **Bear Agent**: Constructs a bearish thesis.
4. **Red Team Critic**: Analyzes both theses and data to find logical gaps and unaddressed risks.
5. **Scorer Agent**: Calculates the 0-100 investment score based on fundamentals, sentiment, momentum, valuation, and risk.
6. **Reflection Loop**: If the score is very low (<50) or the Red Team flags multiple severe gaps, the pipeline loops back to the Thesis Writers with the critique injected.
7. **Memo Writer**: Generates the final Investment Memo in HTML (convertible to PDF).

## How to Run

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
# (or install the dependencies directly: pip install fastapi uvicorn langgraph langchain google-generativeai yfinance httpx sqlalchemy reportlab pydantic sse-starlette)

# Copy the .env template and fill your API keys
cp ../.env.example .env

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the AlphaIntel Dashboard.

## Environment Variables

Copy `.env.example` to `backend/.env` and provide your keys:
- `GEMINI_API_KEY`: Required for the LLM agents.
- `ALPHA_VANTAGE_KEY`: For financial statements.
- `NEWS_API_KEY`: For recent headlines.
- `FMP_KEY`: For competitor comparisons and analyst ratings.
- `DATABASE_URL`: Defaults to `sqlite:///./alphaintel.db`.

*(Note: The system handles missing keys gracefully with warnings, but outputs will be richer with all keys provided.)*

## Key Decisions & Trade-Offs

- **Server-Sent Events (SSE)**: Used to stream LangGraph state updates to the frontend in real-time, providing immediate visual feedback to the user while the multi-step pipeline executes.
- **ReportLab for PDF**: Selected ReportLab instead of WeasyPrint to eliminate the requirement for heavy system dependencies (like GTK3) on Windows environments.
- **Reflection Loop**: Implemented a conditional edge in LangGraph. To avoid cyclic deadlocks, the data processing nodes run first, then the thesis writers, followed by the critic. The reflection loop explicitly targets only the thesis writers.
- **SQLite History**: All generated theses and scores are persistently stored in an SQLite database using SQLAlchemy.

## Future Improvements

1. **Portfolio Impact Analysis**: Implement the `/api/research/batch` endpoint to analyze an entire portfolio and provide weighted aggregate scores.
2. **Tournament Bracket UI**: Build out the frontend visualization for the `/api/tournament` endpoint to let users watch companies battle in real-time.
3. **Advanced PDF Formatting**: Enhance the ReportLab generator to include dynamic charts (using `matplotlib` or ReportLab drawing APIs) and the company logo fetched from Clearbit.
4. **Enhanced Data Quality**: Integrate direct SEC EDGAR XBRL parsing for exact financial metric extraction rather than relying solely on full-text search.
