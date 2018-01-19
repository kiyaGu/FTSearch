const Ajax_request = require("./ajaxRequest");
const createArticleEntry = require("./createArticleEntryDOMElements");
const setPaginationElements = require("./setPaginationElementsValue");
const updateThePage = require("./updateThePage");
// Wait until the page has loaded
if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
) {
    document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));
    // Dispatch a custom event that will tell all required modules to initialise
    document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));
    //if service worker is supported register it

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(function(reg) {
                // registration worked
                console.log("Service Worker Registration succeeded");
            })
            .catch(function(error) {
                // registration failed
                console.log("Service Worker Registration failed with " + error);
            });
    }

    const handlePagination = query => {
        let url = `/search${query}`;
        //if fetch is supported by the client browser
        if (self.fetch) {
            fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    var contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(data => {
                            updateThePage(data);
                        });
                    }
                })
                .catch(error => console.error("Error:", error));
        } else {
            let request = Ajax_request();
            /* fetch the articles/news using XMLHttpRequest/AJAX*/
            (function() {
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        // check if a response was sent back
                        if (request.status === 200) {
                            // check if request was successful
                            let response = JSON.parse(request.responseText);
                            updateThePage(response);
                        } else {
                            alert(
                                "An error occurred during your request: " +
                                request.status +
                                " " +
                                request.statusText
                            );
                        }
                    }
                };

                request.open("GET", url);
                request.setRequestHeader("Accepts", "application/json");
                request.send();
            })();
        }
    };

    //foward pagination
    let searchButton = document.getElementById("headline-search--submit");
    searchButton.addEventListener("click", function(e) {
        const formData = new FormData(
            document.getElementById("headline-search--form")
        );
        //this is used to fetch the json data and store it in cache to be used by
        //service workers in displaying the first page of the result. If not, the first request
        //for search returns html and during pagination it expects json data and reuse the existing template
        //this will cause SyntaxError: Unexpected token < in JSON at position 0
        let q = formData.get("q");
        let url = `/search?q=${q}&page=1`;
        self.navigator.serviceWorker.controller.postMessage({
            url: url
        });
    });

    //foward pagination
    let nextPageButton = document.getElementById("nextPageLink");
    //because they are not yet put to the DOM, need to check
    if (nextPageButton !== null) {
        nextPageButton.addEventListener("click", function(e) {
            e.preventDefault();
            //will be used for get request
            let query = nextPageButton.getAttribute("href");
            handlePagination(query);
        });
    }

    //backward
    let previousPageButton = document.getElementById("previousPageLink");
    //because they are not yet put to the DOM, need to check
    if (previousPageButton !== null) {
        previousPageButton.addEventListener("click", function(e) {
            e.preventDefault();
            let query = previousPageButton.getAttribute("href");
            handlePagination(query);
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {});