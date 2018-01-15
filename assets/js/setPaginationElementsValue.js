module.exports = page => {
    let nexPageNumber = page.nextPage;
    let previousPage = page.previousPage;
    let currentPage = page.currentPage;
    let keyword = page.keyword;

    document.getElementById("currentPage-Number").innerHTML = page.currentPage;
    document.getElementById(
        "previousPage"
    ).href = `?q=${keyword}&page=${previousPage}`;
    document.getElementById(
        "nextPage"
    ).href = `?q=${keyword}&page=${nexPageNumber}`;
    history.replaceState("", "", `?q=${keyword}&page=${currentPage}`);
};