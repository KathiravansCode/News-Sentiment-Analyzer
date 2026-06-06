import { useEffect, useState } from "react";

import api from "../services/api";

import SummaryCards from "../components/SummaryCards";
import SentimentChart from "../components/SentimentChart";
import RecentArticles from "../components/RecentArticles";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("tesla");
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {

    try {

      const summaryResponse =
        await api.get("/analytics/summary");

      const recentResponse =
        await api.get("/analytics/articles/recent");

      setSummary(summaryResponse.data);
      setArticles(recentResponse.data);

    } catch (error) {

      console.error(error);
    }
  };

  const fetchNews = async () => {

    try {

      setLoading(true);

      await api.post(
        `/news/fetch?keyword=${keyword}`
      );

      await fetchDashboardData();

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-5xl font-bold text-center mb-3">
        AI News Sentiment Analyzer
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Analyze live news sentiment using NLP,
        VADER and TextBlob
      </p>

      <div className="flex justify-center gap-3 mb-8">

        <input
          type="text"
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          placeholder="Enter keyword"
          className="border rounded-lg px-4 py-2 w-80"
        />

        <button
          onClick={fetchNews}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading
            ? "Fetching..."
            : "Fetch News"}
        </button>

      </div>

    {summary && (
  <>
    <SummaryCards summary={summary} />
    <SentimentChart summary={summary} />
    <RecentArticles articles={articles} />
  </>
)}

    </div>
  );
}

export default Dashboard;