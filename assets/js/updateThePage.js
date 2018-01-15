const createArticleEntry = require("./createArticleEntryDOMElements");
const setPaginationElements = require("./setPaginationElementsValue");

module.exports = function(response) {
    let ul = document.getElementById("list-of--results");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    response.articles.forEach(article => {
        createArticleEntry(article, ul);
    });
    setPaginationElements(response.articles[0]);
};