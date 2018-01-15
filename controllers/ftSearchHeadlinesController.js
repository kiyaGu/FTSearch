const moment = require("moment");
const ftFetch = require("../api/ftFeatch");

module.exports = function(req, res) {
    let keyword = req.query.q;
    let currentPageNumber = req.query.page ? parseInt(req.query.page) : 1;
    //result to be returned
    let maxResults = 20;
    //offset to be used for pagination
    // 200 is the maximum page that can be shown as the api returns a maximum of 4000 indexable result
    //4000/20(maxresult) = 200
    let offset =
        currentPageNumber >= 1 && currentPageNumber <= 200 ?
        (currentPageNumber - 1) * 20 :
        0;

    ftFetch(req, maxResults, offset).then(response => {
        let articles = [];
        //to be used for pagination page x of totlaNumberOfPages
        let totalNumberOfPages =
            response.results[0].indexCount < 4000 ?
            response.results[0].indexCount > 20 ?
            Math.ceil(response.results[0].indexCount / 20) // result less than 20 => only 1 page
            :
            1 :
            200;

        response.results[0].results.forEach(article => {
            articles.push({
                previousPageNumber: currentPageNumber - 1 >= 1 ? currentPageNumber - 1 : 1,
                currentPageNumber: currentPageNumber,
                nextPageNumber: currentPageNumber + 1 > totalNumberOfPages ?
                    currentPageNumber :
                    currentPageNumber + 1,
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