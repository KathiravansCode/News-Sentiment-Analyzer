import { useEffect, useState, useCallback } from "react";

import api from "../services/api";

import SummaryCards from "../components/SummaryCards";
import SentimentChart from "../components/SentimentChart";
import TrendChart from "../components/TrendChart";
import SourceChart from "../components/SourceChart";
import KeywordChart from "../components/KeywordChart";
import RecentArticles from "../components/RecentArticles";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [keywordData, setKeywordData] = useState([]);

  const [keyword, setKeyword] = useState("tesla");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchKey, setFetchKey] = useState(0);

  const fetchDashboardData = useCallback(async () => {

    try {
      const [summaryRes, trendRes, sourceRes, keywordRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/trend?days=7"),
        api.get("/analytics/sources?limit=10"),
        api.get("/analytics/keyword-trends")
      ]);

      setSummary(summaryRes.data);
      setTrendData(trendRes.data);
      setSourceData(sourceRes.data);
      setKeywordData(keywordRes.data);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, []);

  const fetchNews = async () => {

    const trimmed = keyword.trim();

    if (!trimmed) {
      setError("Please enter a keyword before fetching.");
      return;
    }

    setError("");

    try {
      setLoading(true);

      await api.post(`/news/fetch?keyword=${encodeURIComponent(trimmed)}`);

      // Refresh all dashboard data + trigger RecentArticles refresh
      await fetchDashboardData();
      setFetchKey((k) => k + 1);

    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchNews();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-3">
          AI-powered News Sentiment Analyzer
        </h1>
        <p className="text-gray-500 text-lg">
          Analyze live news sentiment using NLP, VADER and TextBlob
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col items-center gap-3 mb-8">

        <div className="flex gap-3 w-full max-w-xl">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter keyword (e.g. Tesla, AI, Bitcoin)"
            className={`border rounded-lg px-4 py-2 flex-1 outline-none focus:ring-2
              ${error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
              }`}
          />

          <button
            onClick={fetchNews}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg
              hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors font-medium whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Fetching...
              </span>
            ) : (
              "Fetch News"
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

      </div>

      {/* Summary Cards — always shown if data exists */}
      {summary ? (
        <>
          <SummaryCards summary={summary} />

          {/* Row 1: Pie + Line chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SentimentChart summary={summary} />
            <TrendChart trendData={trendData} />
          </div>

          {/* Row 2: Source + Keyword charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SourceChart sourceData={sourceData} />
            <KeywordChart keywordData={keywordData} />
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">📰</p>
          <p className="text-xl font-medium">No data yet</p>
          <p className="text-sm mt-2">
            Enter a keyword above and click Fetch News to get started.
          </p>
        </div>
      )}

      {/* Articles table — always mounted, uses its own fetch + fetchKey to refresh */}
      <RecentArticles key={fetchKey} />

    </div>
  );
}

export default Dashboard;