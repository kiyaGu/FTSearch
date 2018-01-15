module.exports = page => {
    let nexPageNumber = page.nextPageNumber;
    let previousPageNumber = page.previousPageNumber;
    let currentPageNumber = page.currentPageNumber;
    let keyword = page.keyword;
    //update the current page number displayed
    document.getElementById("currentPage-Number").innerHTML =
        page.currentPageNumber;
    //set this values for backward navigation
    document.getElementById(
        "previousPage"
    ).href = `?q=${keyword}&page=${previousPageNumber}`;
    //set this values for forward navigation
    document.getElementById(
        "nextPage"
    ).href = `?q=${keyword}&page=${nexPageNumber}`;
    //modify the address bar to reflect the current page without page reload
    history.replaceState("", "", `?q=${keyword}&page=${currentPageNumber}`);
};