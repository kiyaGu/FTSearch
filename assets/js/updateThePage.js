const createArticleEntry = require("./createArticleEntryDOMElements");
const setPaginationElements = require("./setPaginationElementsValue");

module.exports = function(response) {
    // get the <ul> that holds all the dispalyed articles
    let ul = document.getElementById("list-of--results");
    //remove all the current childer nodes
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    // update the <ul> with the new  list of artcles
    response.articles.forEach(article => {
        createArticleEntry(article, ul);
    });
    //modify the page number displayed
    setPaginationElements(response.articles[0]);
};