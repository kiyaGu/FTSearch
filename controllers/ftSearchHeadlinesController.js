const moment = require("moment");
const ftClient = require("../api/ftClient");

module.exports = function(req, res) {
    const keyword = `title:\"${req.query.q}\"`;
    //if the page number is passed
    const currentPageNumber = req.query.page ? parseInt(req.query.page) : 1;

    //result to be returned
    const maxResults = 20;

    //offset to be used for pagination as the api does not serve more than 1000 results for any search query
    //50 is the maximum page that can be shown 10000/20(maxresult) = 50

    //if we have one page or more than result the page is one constructed is one
    const offset =
        currentPageNumber >= 1 && currentPageNumber <= 50 ?
        (currentPageNumber - 1) * 20 :
        0;

    ftClient(keyword, maxResults, offset)
        .then(response => {
            const articles = [];
            //used for pagination and requesting further results
            const pageInformation = {};
            //to be used for pagination control
            const totalNumberOfPages =
                response.results[0].indexCount < 1000 ?
                response.results[0].indexCount > 20 ?
                Math.ceil(response.results[0].indexCount / 20) //b/n 20 and 1000
                :
                1 // result less than 20 => only 1 page
                :
                50; // result greater than 1000 => 50 page

            //if at page 1, no more previous pageNumber stay at 1
            pageInformation.previousPageNumber =
                currentPageNumber - 1 >= 1 ? currentPageNumber - 1 : 1;

            pageInformation.currentPageNumber = currentPageNumber;
            //as long as it is less than total number of pages currentPage++
            pageInformation.nextPageNumber =
                currentPageNumber + 1 > totalNumberOfPages ?
                currentPageNumber :
                currentPageNumber + 1;

            pageInformation.totalNumberOfPages = totalNumberOfPages;
            //construct the articles form the returned result by taking the give attributes
            response.results[0].results.forEach(article => {
                articles.push({
                    keyword: req.query.q,
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
            return { pageInformation: pageInformation, articles: articles };
        })
        .then(response => {
            const contentType = req.headers["content-type"];
            if (contentType == "application/json") {
                //for ajax and fetch implementations of pagination
                res.json(response);
            } else {
                //fetching with JS disabled
                res.render("articles", response);
            }
        });
};