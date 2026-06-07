import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function KeywordChart({ keywordData }) {

  if (!keywordData || keywordData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          Top Searched Keywords
        </h2>
        <p className="text-gray-400 text-center py-8">
          No keyword history yet. Start fetching news!
        </p>
      </div>
    );
  }

  const data = {
    labels: keywordData.map((k) => k.keyword),
    datasets: [
      {
        label: "Positive",
        data: keywordData.map((k) => k.positive),
        backgroundColor: "#22c55e"
      },
      {
        label: "Negative",
        data: keywordData.map((k) => k.negative),
        backgroundColor: "#ef4444"
      },
      {
        label: "Neutral",
        data: keywordData.map((k) => k.neutral),
        backgroundColor: "#eab308"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          afterBody: (items) => {
            const idx = items[0].dataIndex;
            const kw = keywordData[idx];
            return `Total Articles: ${kw.total_articles}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Top Searched Keywords
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default KeywordChart;