function SummaryCards({ summary }) {

    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "20px"
            }}
        >

            <div>
                <h3>Total</h3>
                <p>{summary.total_articles}</p>
            </div>

            <div>
                <h3>Positive</h3>
                <p>{summary.positive}</p>
            </div>

            <div>
                <h3>Negative</h3>
                <p>{summary.negative}</p>
            </div>

            <div>
                <h3>Neutral</h3>
                <p>{summary.neutral}</p>
            </div>

        </div>
    );
}

export default SummaryCards;