from sqlalchemy.orm import Session

from models.article import Article


class ArticleService:

    @staticmethod
    def save_article(
        db: Session,
        article_data: dict
    ):

        existing_article = (
            db.query(Article)
            .filter(Article.url == article_data["url"])
            .first()
        )

        if existing_article:
            return existing_article

        article = Article(**article_data)

        db.add(article)

        db.commit()

        db.refresh(article)

        return article