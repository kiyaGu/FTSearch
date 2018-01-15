const moment = require("moment");
const ftFetch = require("../api/ftFeatch");

module.exports = function(req, res) {
    //fetch only the latest 9 results
    let maxResults = 9;
    let offset = 0;

    ftFetch(req, maxResults, offset)
        .then(response => {
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
        })
        .catch(function(err) {
            // Will catch failure of first failed promise
            console.log("Failed:", err);
        });
};