const moment = require("moment");
const ftClient = require("../api/ftClient");

module.exports = function(req, res) {
    //fetch only the latest 9 results
    let maxResults = 9;
    let offset = 0;
    let keyword = "";

    ftClient(keyword, maxResults, offset)
        .then(response => {
            return response.results[0].results.map(article => {
                return {
                    keyword: "FT Latest",
                    title: article.title.title,
                    author: article.editorial.byline,
                    excerpt: article.summary.excerpt,
                    publicationDate: moment(
                        article.lifecycle.initialPublishDateTime
                    ).format("dddd, Do MMMM, YYYY"),
                    link: article.location.uri,
                    tag: article.metadata.primarySection ?
                        article.metadata.primarySection.term.name :
                        "General",
                    tagLink: article.metadata.primarySection ?
                        `https://www.ft.com/${article.metadata.primarySection.term.name.toLowerCase()}` :
                        "#"
                };
            });
        })
        .then(response => {
            res.render("home", { articles: response });
        })
        .catch(function(err) {
            // Will catch failure of first failed promise
            console.log("Failed:", err);
        });
};