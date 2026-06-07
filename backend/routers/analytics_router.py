from fastapi import APIRouter, Depends, Query
from typing import Optional

from sqlalchemy.orm import Session

from database.dependencies import get_db

from services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/sentiment")
def get_sentiment_summary(
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_sentiment_summary(db)


@router.get("/articles")
def get_all_articles(
    db: Session = Depends(get_db),
    sentiment: Optional[str] = Query(
        None,
        description="Filter by sentiment: positive, negative, neutral"
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
    sort_by: str = Query(
        "created_at",
        description="Sort field: created_at, published_at, score"
    ),
    order: str = Query("desc", description="asc or desc")
):
    return AnalyticsService.get_articles_filtered(
        db,
        sentiment=sentiment,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        order=order
    )


@router.get("/articles/recent")
def get_recent_articles(
    db: Session = Depends(get_db)
):
    articles = AnalyticsService.get_recent_articles(db)
    return articles


@router.get("/articles/count")
def get_articles_count(
    db: Session = Depends(get_db),
    sentiment: Optional[str] = Query(None)
):
    return AnalyticsService.get_articles_count(db, sentiment=sentiment)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_dashboard_summary(db)


@router.get("/trend")
def get_sentiment_trend(
    db: Session = Depends(get_db),
    days: int = Query(7, ge=1, le=30, description="Number of past days to include")
):
    return AnalyticsService.get_sentiment_trend(db, days=days)


@router.get("/sources")
def get_source_breakdown(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    return AnalyticsService.get_source_breakdown(db, limit=limit)


@router.get("/top-articles")
def get_top_articles(
    db: Session = Depends(get_db),
    sentiment: str = Query(
        "positive",
        description="positive or negative"
    ),
    limit: int = Query(5, ge=1, le=20)
):
    return AnalyticsService.get_top_articles(db, sentiment=sentiment, limit=limit)


@router.get("/search-history")
def get_search_history(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    return AnalyticsService.get_search_history(db, limit=limit)


@router.get("/keyword-trends")
def get_keyword_trends(
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_keyword_trends(db)