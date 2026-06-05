function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Articles",
      value: summary.total_articles,
      color: "bg-blue-500"
    },
    {
      title: "Positive",
      value: summary.positive,
      color: "bg-green-500"
    },
    {
      title: "Negative",
      value: summary.negative,
      color: "bg-red-500"
    },
    {
      title: "Neutral",
      value: summary.neutral,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} text-white rounded-xl shadow-lg p-6`}
        >
          <h3 className="text-lg font-semibold">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;