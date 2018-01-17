const setElementAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
};
const removeElementAttribute = function(element, attribute) {
    element.removeAttribute(attribute);
};

const updatePaginationElementsAttributes = function(page) {
    const nextPageNumber = page.nextPageNumber;
    const previousPageNumber = page.previousPageNumber;
    const currentPageNumber = page.currentPageNumber;

    const previousLink = document.getElementById("previousPageLink");
    const nextPageLink = document.getElementById("nextPageLink");

    const previousButton = document.getElementById("previousPageButton");
    const nextPageButton = document.getElementById("nextPageButton");

    if (currentPageNumber === 1) {
        setElementAttribute(previousLink, "class", "inactiveLink");
        setElementAttribute(previousButton, "disabled", "disabled");
    } else {
        setElementAttribute(previousLink, "class", "");
        removeElementAttribute(previousButton, "disabled");
    }
    if (nextPageNumber === page.totalNumberOfPages) {
        setElementAttribute(nextPageLink, "class", "inactiveLink");
        setElementAttribute(nextPageButton, "disabled", "disabled");
    } else {
        setElementAttribute(nextPageLink, "class", "");
        removeElementAttribute(nextPageButton, "disabled");
    }
};
module.exports = (page, keyword) => {
    //if there is no more pagination to do disable the pagination elements
    updatePaginationElementsAttributes(page);
    //update the current page number displayed
    document.getElementById("currentPage-Number").innerHTML =
        page.currentPageNumber;
    //set this value for backward pagination
    document.getElementById("previousPageLink").href = `?q=${keyword}&page=${
    page.previousPageNumber
  }`;
    //set this values for forward pagination
    document.getElementById("nextPageLink").href = `?q=${keyword}&page=${
    page.nextPageNumber
  }`;
    //modify the address bar to reflect the current page without page reload
    history.replaceState("", "", `?q=${keyword}&page=${page.currentPageNumber}`);
};