from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob


class SentimentService:

    analyzer = SentimentIntensityAnalyzer()

    @staticmethod
    def analyze(text: str):

        # Handle null or empty values
        if not text:
            return {
                "sentiment": "neutral",
                "vader_score": 0.0,
                "textblob_score": 0.0
            }

        vader_result = SentimentService.analyzer.polarity_scores(text)

        compound = vader_result["compound"]

        textblob_score = TextBlob(text).sentiment.polarity

        if compound >= 0.05:
            sentiment = "positive"

        elif compound <= -0.05:
            sentiment = "negative"

        else:
            sentiment = "neutral"

        return {
            "sentiment": sentiment,
            "vader_score": compound,
            "textblob_score": textblob_score
        }