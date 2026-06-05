from fastapi import APIRouter
from fastapi import Depends

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
    db: Session = Depends(get_db)
):

    articles = AnalyticsService.get_all_articles(db)

    return articles


@router.get("/articles/recent")
def get_recent_articles(
    db: Session = Depends(get_db)
):

    articles = AnalyticsService.get_recent_articles(db)

    return articles

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db)
):

    return AnalyticsService.get_dashboard_summary(db)