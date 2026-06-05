function RecentArticles({ articles }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Recent Articles
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left p-3">
                Title
              </th>

              <th className="text-left p-3">
                Sentiment
              </th>
            </tr>
          </thead>

          <tbody>

            {articles.map((article) => (
              <tr
                key={article.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-3">
                  {article.title}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm
                    ${
                      article.sentiment === "positive"
                        ? "bg-green-500"
                        : article.sentiment === "negative"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {article.sentiment}
                  </span>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default RecentArticles;