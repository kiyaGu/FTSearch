const moment = require("moment");
moment().format();
module.exports = function(res) {
    fetch("http://api.ft.com/content/search/v1", {
            method: "POST",
            headers: {
                "X-Api-Key": "59cbaf20e3e06d3565778e7bbfc218a2dde8436ba6af7ed77d5afa7e",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                queryString: "",
                queryContext: {
                    curations: ["ARTICLES"]
                },
                resultContext: {
                    maxResults: 9,
                    offset: 0,
                    contextual: true,
                    aspects: [
                        "title",
                        "summary",
                        "editorial",
                        "location",
                        "metadata",
                        "lifecycle"
                    ]
                }
            })
        })
        .then(function(response) {
            if (response.status >= 400) {
                throw new Error("The resource is not found");
            }
            return response.json();
        })
        .then(function(response) {
            let articles = [];
            response.results[0].results.forEach(article => {
                articles.push({
                    keyword: "latest",
                    title: article.title.title,
                    author: article.editorial.byline,
                    excerpt: article.summary.excerpt,
                    publicationDate: moment(
                        article.lifecycle.initialPublishDateTime
                    ).format("dddd, Do MMMM, YYYY"),
                    link: article.location.uri,
                    tag: article.metadata.primarySection.term.name,
                    tagLink: `https://www.ft.com/${article.metadata.primarySection.term.name.toLowerCase()}`
                });
            });

            res.render("home", { articles: articles });
        });
};