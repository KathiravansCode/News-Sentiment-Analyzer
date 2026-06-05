function RecentArticles({ articles }) {

    return (

        <div>

            <h2>Recent Articles</h2>

            <table border="1">

                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Sentiment</th>
                    </tr>
                </thead>

                <tbody>

                    {
                        articles.map(article => (

                            <tr key={article.id}>

                                <td>
                                    {article.title}
                                </td>

                                <td>
                                    {article.sentiment}
                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );
}

export default RecentArticles;