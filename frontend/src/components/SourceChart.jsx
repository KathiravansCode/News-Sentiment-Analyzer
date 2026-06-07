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

function SourceChart({ sourceData }) {

  if (!sourceData || sourceData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          Sentiment by Source
        </h2>
        <p className="text-gray-400 text-center py-8">
          No source data yet. Fetch some news to see the breakdown.
        </p>
      </div>
    );
  }

  // Limit to top 8 for readability
  const top = sourceData.slice(0, 8);

  const data = {
    labels: top.map((s) => s.source),
    datasets: [
      {
        label: "Positive",
        data: top.map((s) => s.positive),
        backgroundColor: "#22c55e"
      },
      {
        label: "Negative",
        data: top.map((s) => s.negative),
        backgroundColor: "#ef4444"
      },
      {
        label: "Neutral",
        data: top.map((s) => s.neutral),
        backgroundColor: "#eab308"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 30,
          minRotation: 0
        }
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
        Sentiment by Source
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default SourceChart;