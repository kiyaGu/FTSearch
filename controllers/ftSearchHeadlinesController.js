const moment = require("moment");
const ftFetch = require("../api/ftFeatch");
moment().format();
module.exports = function(req, res) {
    let keyword = req.query.q;
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let maxResults = 20;
    let offset =
        currentPage >= 1 && currentPage <= 200 ? (currentPage - 1) * 20 : 0;

    ftFetch(req, maxResults, offset).then(response => {
        let articles = [];
        let totalNumberOfPages =
            response.results[0].indexCount < 4000 ?
            response.results[0].indexCount > 20 ?
            Math.ceil(response.results[0].indexCount / 20) :
            1 :
            200;

        response.results[0].results.forEach(article => {
            articles.push({
                previousPage: currentPage - 1 >= 1 ? currentPage - 1 : 1,
                currentPage: currentPage,
                nextPage: currentPage + 1 > totalNumberOfPages ? currentPage : currentPage + 1,
                totalNumberOfPages: totalNumberOfPages,
                keyword: response.query.queryString,
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
            });
        });

        let contentType = req.headers["content-type"];
        if (contentType == "application/json") {
            //for ajax and fetch implementations of pagination
            res.json({ articles: articles });
        } else {
            res.render("articles", { articles: articles });
        }
    });
};