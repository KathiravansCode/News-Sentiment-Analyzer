from fastapi import APIRouter,Depends

from sqlalchemy.orm import Session
from datetime import datetime

from services.article_service import ArticleService
from services.news_service import NewsService
from services.sentiment_service import SentimentService

from database.dependencies import get_db

router = APIRouter(
    prefix="/news",
    tags=["News"]
)


@router.get("")
def get_news(keyword: str):

    articles = NewsService.fetch_news(keyword)

    return {
        "keyword": keyword,
        "count": len(articles),
        "articles": articles
    }


@router.post("/fetch")
def fetch_and_save_news(
    keyword: str,
    db: Session = Depends(get_db)
):

    articles = NewsService.fetch_news(keyword)

    positive = 0
    negative = 0
    neutral = 0

    for article in articles:

        title = article.get("title")

        if not title:
            continue

        sentiment_result = SentimentService.analyze(title)

        sentiment = sentiment_result["sentiment"]

        if sentiment == "positive":
            positive += 1

        elif sentiment == "negative":
            negative += 1

        else:
            neutral += 1

        published_at = None

        if article.get("published_at"):

            published_at = datetime.fromisoformat(
                article["published_at"].replace("Z", "+00:00")
            )

        article_data = {
            "title": article.get("title"),
            "source": article.get("source"),
            "category": "general",
            "author": article.get("author"),
            "description": article.get("description"),
            "url": article.get("url"),
            "published_at": published_at,
            "sentiment": sentiment_result["sentiment"],
            "score": sentiment_result["vader_score"]
        }

        ArticleService.save_article(
            db,
            article_data
        )

    return {
        "saved_articles": len(articles),
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }