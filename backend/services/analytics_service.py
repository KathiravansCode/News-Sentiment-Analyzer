from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, case
from datetime import datetime, timedelta, timezone

from models.article import Article
from models.search_history import SearchHistory


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
    def get_articles_filtered(
        db: Session,
        sentiment: str = None,
        skip: int = 0,
        limit: int = 20,
        sort_by: str = "created_at",
        order: str = "desc"
    ):
        query = db.query(Article)

        if sentiment and sentiment in ("positive", "negative", "neutral"):
            query = query.filter(Article.sentiment == sentiment)

        sort_column_map = {
            "created_at": Article.created_at,
            "published_at": Article.published_at,
            "score": Article.score
        }

        sort_col = sort_column_map.get(sort_by, Article.created_at)

        if order == "asc":
            query = query.order_by(asc(sort_col))
        else:
            query = query.order_by(desc(sort_col))

        articles = query.offset(skip).limit(limit).all()

        return articles

    @staticmethod
    def get_articles_count(db: Session, sentiment: str = None):

        query = db.query(Article)

        if sentiment and sentiment in ("positive", "negative", "neutral"):
            query = query.filter(Article.sentiment == sentiment)

        return {"count": query.count()}

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

    @staticmethod
    def get_sentiment_trend(db: Session, days: int = 7):
        """
        Returns daily sentiment counts for the past N days.
        Groups articles by their published_at date.
        """

        since = datetime.now(timezone.utc) - timedelta(days=days)

        results = (
            db.query(
                func.date(Article.published_at).label("date"),
                Article.sentiment,
                func.count(Article.id).label("count")
            )
            .filter(Article.published_at >= since)
            .group_by(
                func.date(Article.published_at),
                Article.sentiment
            )
            .order_by(func.date(Article.published_at))
            .all()
        )

        # Build a dict keyed by date
        trend_map = {}

        for row in results:
            date_str = str(row.date)
            if date_str not in trend_map:
                trend_map[date_str] = {
                    "date": date_str,
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0
                }
            trend_map[date_str][row.sentiment] = row.count

        # Fill in missing dates so frontend always gets N days
        trend_data = []
        for i in range(days):
            day = (datetime.now(timezone.utc) - timedelta(days=days - 1 - i)).date()
            day_str = str(day)
            if day_str in trend_map:
                trend_data.append(trend_map[day_str])
            else:
                trend_data.append({
                    "date": day_str,
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0
                })

        return trend_data

    @staticmethod
    def get_source_breakdown(db: Session, limit: int = 10):
        """
        Returns sentiment counts per news source.
        """

        results = (
            db.query(
                Article.source,
                Article.sentiment,
                func.count(Article.id).label("count")
            )
            .filter(Article.source != None)
            .group_by(Article.source, Article.sentiment)
            .all()
        )

        source_map = {}

        for row in results:
            source = row.source or "Unknown"
            if source not in source_map:
                source_map[source] = {
                    "source": source,
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0,
                    "total": 0
                }
            source_map[source][row.sentiment] += row.count
            source_map[source]["total"] += row.count

        # Sort by total desc, return top N
        sorted_sources = sorted(
            source_map.values(),
            key=lambda x: x["total"],
            reverse=True
        )

        return sorted_sources[:limit]

    @staticmethod
    def get_top_articles(db: Session, sentiment: str = "positive", limit: int = 5):
        """
        Returns top N articles by vader score for a given sentiment.
        """

        if sentiment == "positive":
            order_col = desc(Article.score)
        else:
            order_col = asc(Article.score)

        articles = (
            db.query(Article)
            .filter(Article.sentiment == sentiment)
            .order_by(order_col)
            .limit(limit)
            .all()
        )

        return articles

    @staticmethod
    def get_search_history(db: Session, limit: int = 10):
        """
        Returns the most recent keyword searches.
        """

        history = (
            db.query(SearchHistory)
            .order_by(SearchHistory.searched_at.desc())
            .limit(limit)
            .all()
        )

        return history

    @staticmethod
    def get_keyword_trends(db: Session):
        """
        Returns top searched keywords with their total article counts.
        Used for the keyword bar chart.
        """

        results = (
            db.query(
                SearchHistory.keyword,
                func.count(SearchHistory.id).label("search_count"),
                func.sum(SearchHistory.article_count).label("total_articles"),
                func.sum(SearchHistory.positive).label("positive"),
                func.sum(SearchHistory.negative).label("negative"),
                func.sum(SearchHistory.neutral).label("neutral"),
            )
            .group_by(SearchHistory.keyword)
            .order_by(desc(func.sum(SearchHistory.article_count)))
            .limit(10)
            .all()
        )

        return [
            {
                "keyword": row.keyword,
                "search_count": row.search_count,
                "total_articles": row.total_articles or 0,
                "positive": row.positive or 0,
                "negative": row.negative or 0,
                "neutral": row.neutral or 0,
            }
            for row in results
        ]