# AlphaIntel - Project Issues & Resolutions Log

This document serves as a post-mortem and knowledge base for the technical challenges encountered during the development of the AlphaIntel Investment AI platform, and the specific solutions implemented to resolve them.

## 1. Migration from Gemini to Groq API
**Problem**: The project was originally built using Google's Gemini SDK. Due to API quota constraints and the desire for faster inference, the backend needed to be migrated to Groq (specifically LLaMA models).
**Resolution**: Rather than rewriting all agents, a `GroqAdapter` and `DummyResponse` wrapper were created in `utils.py`. This intercepted Gemini-style `generate_content()` calls and routed them to the Groq SDK, allowing all agents to function without requiring massive structural rewrites.

## 2. Groq API Rate Limiting (TPM and TPD Exhaustion)
**Problem**: The agent pipeline generates very large context windows (fetching SEC filings, news, and financial data). This quickly exhausted Groq's Free Tier limits for `llama-3.3-70b-versatile`—specifically the 30,000 Tokens Per Minute (TPM) limit and the 100,000 Tokens Per Day (TPD) limit.
**Resolution**: 
- Added a `time.sleep(2)` delay between sequential agent calls to throttle TPM usage.
- Implemented a robust `try-except` fallback mechanism in `utils.py`. If a `429 Too Many Requests` error is caught, the system automatically falls back to a lighter model with higher rate limits to ensure the pipeline doesn't crash mid-analysis.

## 3. Decommissioned Models Breaking Fallbacks
**Problem**: We initially set the rate-limit fallback to use `mixtral-8x7b-32768`. However, Groq abruptly decommissioned this model, resulting in fatal `400 Bad Request: model_decommissioned` errors that halted the pipeline.
**Resolution**: Updated the fallback architecture to rely strictly on currently supported and active models, settling on `llama-3.1-8b-instant` as the designated fallback.

## 4. LLM Hallucinations & JSON Schema Violations
**Problem**: When the pipeline fell back to smaller 8B models (due to rate limits), their reasoning capabilities degraded. The `scorer_agent` asked for specific sub-scores with maximum limits (e.g., Risk max 15). The 8B model hallucinated values like `Risk: 50`, causing the UI dials and progress bars to break or overflow.
**Resolution**: Hardened the JSON parsing logic in `scorer_agent.py`. Instead of blindly trusting the LLM's output, the code now extracts the raw JSON, casts it to integers, and strictly bounds every single sub-score using `min()` and `max()` clamps (e.g., `min(15, max(0, risk))`). The total score is then dynamically recalculated by summing these clamped values.

## 5. PDF Generator Dropping Memo Content
**Problem**: The `memo_agent` generates a detailed investment memo in HTML format, which `pdf_generator.py` converts to a PDF using ReportLab. The original parser used a strict Regex that only extracted text if it was perfectly wrapped in `<p>` or `<li>` tags. When fallback models output raw text without these tags, the PDF generated was entirely empty except for the headers.
**Resolution**: Completely rewrote the HTML-to-PDF parser. Instead of relying on strict HTML block tags, it now processes the output line-by-line. It strips any HTML tags dynamically, detects headers based on remaining substrings, and converts all other non-empty lines into ReportLab `BodyText` paragraphs. This guarantees zero data loss regardless of LLM formatting quirks.

## 6. Server-Sent Events (SSE) Parsing Failures
**Problem**: The frontend `useResearchStream.ts` hook listens for live updates from the backend via SSE. Initially, the UI was not updating because the frontend expected a strict JSON schema containing `"type": "agent_complete"` and a `"data"` object, which the backend was not providing.
**Resolution**: Modified the FastAPI SSE generator in `main.py` to intercept LangGraph node updates, inject the correct `type` fields, and structure the payloads exactly as the React hooks expected.


## 7. Static Model vs Real-Time Knowledge
**Problem**: The Groq/LLaMA models currently powering the platform have static training data cutoffs (e.g., late 2023). They are not intrinsically "up-to-date" on current market conditions unless explicitly provided with live data via our data fetchers (SEC filings, news APIs). 
**Resolution (Future Improvement)**: Migrating back to, or offering an option to use, an internet-connected and constantly updated model like Google's `gemini-1.5-pro` would vastly improve the model's baseline awareness of current macroeconomic trends, live company events, and real-time investment sentiment without needing perfectly comprehensive external data pipelines.

## 8. Stale Research Output Due to LLM Training Cutoff
**Problem**: After migrating to Groq's LLaMA models, the investment research reports began referencing outdated information despite the pipeline successfully fetching live data from yfinance, NewsAPI, SEC EDGAR, and FMP. For example, reports on Apple referenced the iPhone 14 cycle and Q2 2023 earnings figures, and Tesla reports cited prices and news events from 2023. This occurred because LLaMA models (both `llama-3.3-70b-versatile` and the fallback `llama-3.1-8b-instant`) have a training cutoff of approximately early 2024. When live context data was injected into prompts, the models — particularly the smaller 8B fallback — defaulted to recalling figures from training memory instead of reasoning strictly on the provided data. This is a fundamental limitation of static open-source models hosted on inference APIs: they cannot browse the web or access real-time information, and weaker models frequently ignore injected context in favour of memorised facts.
**Resolution**:
- Restructured all agent prompts so that live fetched data appears at the very top of the prompt, before any instructions, forcing the model to process it first.
- Added an explicit system-level instruction to all agents: *"Use ONLY the data provided below. Do NOT use your training knowledge for any financial figures, prices, dates, or news events. If a field is missing, state 'data unavailable' rather than inferring from memory."*
- Added backend logging after each data fetcher call (`logger.info`) to confirm that non-empty, live data payloads are actually reaching the agent prompts, making it easy to distinguish between a data fetching failure and a model reasoning failure.
- Identified this as a known architectural trade-off: open-source models on free inference tiers prioritise speed and cost over reasoning depth. For production or evaluated demos where research quality is critical, switching the primary model back to Gemini 2.5 Flash (which has a more recent knowledge cutoff and stronger instruction-following) is recommended, using Groq only as a speed/cost fallback.
