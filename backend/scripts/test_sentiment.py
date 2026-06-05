from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

print(
    analyzer.polarity_scores(
        "Tesla stock surges after strong earnings"
    )
)