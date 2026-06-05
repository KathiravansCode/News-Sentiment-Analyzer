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
                ]
            }
        ]
    };

    return (

        <div
            style={{
                width: "400px",
                marginBottom: "40px"
            }}
        >
            <Pie data={data} />
        </div>

    );
}

export default SentimentChart;