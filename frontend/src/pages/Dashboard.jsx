import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCards from "../components/SummaryCards";
import SentimentChart from "../components/SentimentChart";
import RecentArticles from "../components/RecentArticles";

function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [articles, setArticles] = useState([]);

    const [keyword, setKeyword] = useState("tesla");

    const fetchDashboardData = async () => {

        try {

            const summaryResponse =
                await api.get("/analytics/summary");

            const articlesResponse =
                await api.get("/analytics/articles/recent");

            setSummary(summaryResponse.data);

            setArticles(articlesResponse.data);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchNews = async () => {

        try {

            await api.post(
                `/news/fetch?keyword=${keyword}`
            );

            fetchDashboardData();

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    return (
        <div style={{ padding: "20px" }}>

            <h1>AI News Sentiment Analyzer</h1>

            <div
                style={{
                    marginBottom: "20px"
                }}
            >
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                />

                <button
                    onClick={fetchNews}
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Fetch News
                </button>
            </div>

            {
                summary &&
                <>
                    <SummaryCards summary={summary} />

                    <SentimentChart summary={summary} />
                </>
            }

            <RecentArticles articles={articles} />

        </div>
    );
}

export default Dashboard;