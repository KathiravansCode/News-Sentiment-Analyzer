import requests

from config.settings import NEWS_API_KEY


class NewsService:

    BASE_URL = "https://newsapi.org/v2/everything"

    @staticmethod
    def fetch_news(keyword: str):

        params = {
            "q": keyword,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 20,
            "apiKey": NEWS_API_KEY
        }

        response = requests.get(
            NewsService.BASE_URL,
            params=params
        )

        response.raise_for_status()

        data = response.json()

        articles = []

        for article in data.get("articles", []):

            articles.append({
                "title": article.get("title"),
                "source": article.get("source", {}).get("name"),
                "author": article.get("author"),
                "description": article.get("description"),
                "url": article.get("url"),
                "published_at": article.get("publishedAt")
            })

        return articles