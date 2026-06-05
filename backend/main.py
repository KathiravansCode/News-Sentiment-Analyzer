from fastapi import FastAPI

app = FastAPI(
    title="AI News Sentiment Analyzer",
    version="1.0.0"
)

@app.get("/health")
def health():
    return {
        "status": "running"
    }