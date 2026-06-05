from fastapi import APIRouter

from services.news_service import NewsService

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