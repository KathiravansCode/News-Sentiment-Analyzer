import { useEffect, useState } from "react";
import api from "../services/api";

function RecentArticles() {

  const [articles, setArticles] = useState([]);
  const [sentiment, setSentiment] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 10;

  const fetchArticles = async () => {

    try {
      setLoading(true);

      const params = new URLSearchParams({
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        sort_by: "created_at",
        order: "desc"
      });

      if (sentiment) {
        params.append("sentiment", sentiment);
      }

      const [articlesRes, countRes] = await Promise.all([
        api.get(`/analytics/articles?${params.toString()}`),
        api.get(
          `/analytics/articles/count${sentiment ? `?sentiment=${sentiment}` : ""}`
        )
      ]);

      setArticles(articlesRes.data);
      setTotalCount(countRes.data.count);

    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [sentiment, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const sentimentBadge = (s) => {
    if (s === "positive")
      return "bg-green-500";
    if (s === "negative")
      return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h2 className="text-2xl font-bold">
          Articles
        </h2>

        {/* Filter bar */}
        <div className="flex gap-2">
          {["", "positive", "negative", "neutral"].map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setSentiment(s);
                setPage(0);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
                ${
                  sentiment === s
                    ? s === "positive"
                      ? "bg-green-500 text-white border-green-500"
                      : s === "negative"
                      ? "bg-red-500 text-white border-red-500"
                      : s === "neutral"
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>

      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing{" "}
        {Math.min(page * PAGE_SIZE + 1, totalCount)}–
        {Math.min((page + 1) * PAGE_SIZE, totalCount)} of{" "}
        {totalCount} articles
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 rounded animate-pulse"
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No articles found for this filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-gray-600 font-semibold">
                  Title
                </th>
                <th className="text-left p-3 text-gray-600 font-semibold">
                  Source
                </th>
                <th className="text-left p-3 text-gray-600 font-semibold">
                  Sentiment
                </th>
                <th className="text-left p-3 text-gray-600 font-semibold">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3 max-w-sm">
                    {article.url ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-2"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span className="line-clamp-2">{article.title}</span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-500 whitespace-nowrap">
                    {article.source || "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${sentimentBadge(
                        article.sentiment
                      )}`}
                    >
                      {article.sentiment}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                    {article.score?.toFixed(3) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg border text-sm font-medium
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-slate-100 transition-colors"
          >
            ← Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-lg border text-sm font-medium
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-slate-100 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}

export default RecentArticles;