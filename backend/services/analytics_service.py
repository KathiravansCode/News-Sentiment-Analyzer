from sqlalchemy.orm import Session

from models.article import Article


class AnalyticsService:

    @staticmethod
    def get_sentiment_summary(db: Session):

        positive = (
            db.query(Article)
            .filter(Article.sentiment == "positive")
            .count()
        )

        negative = (
            db.query(Article)
            .filter(Article.sentiment == "negative")
            .count()
        )

        neutral = (
            db.query(Article)
            .filter(Article.sentiment == "neutral")
            .count()
        )

        return {
            "positive": positive,
            "negative": negative,
            "neutral": neutral
        }

    @staticmethod
    def get_all_articles(db: Session):

        return db.query(Article).all()

    @staticmethod
    def get_recent_articles(db: Session):

        return (
            db.query(Article)
            .order_by(Article.created_at.desc())
            .limit(10)
            .all()
        )
    @staticmethod
    def get_dashboard_summary(db: Session):

       total_articles = db.query(Article).count()

       positive = (
        db.query(Article)
        .filter(Article.sentiment == "positive")
        .count()
       )

       negative = (
        db.query(Article)
        .filter(Article.sentiment == "negative")
        .count()
       )

       neutral = (
        db.query(Article)
        .filter(Article.sentiment == "neutral")
        .count()
       )

       return {
        "total_articles": total_articles,
        "positive": positive,
        "negative": negative,
        "neutral": neutral
      }