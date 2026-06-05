import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function SentimentChart({ summary }) {

  const data = {
    labels: [
      "Positive",
      "Negative",
      "Neutral"
    ],

    datasets: [
      {
        data: [
          summary.positive,
          summary.negative,
          summary.neutral
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#eab308"
        ]
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Sentiment Distribution
      </h2>

      <div className="max-w-md mx-auto">
        <Pie data={data} />
      </div>

    </div>
  );
}

export default SentimentChart;