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
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./serviceWorker.js").then(function() {
            console.log("Service Worker Registered");
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
                .then(res => res.json())
                .catch(error => console.error("Error:", error))
                .then(response => {
                    updateThePage(response);
                });
        } else {
            let request = Ajax_request();
            /* to dynamically fetching the news from the API */
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
    let nextPageButton = document.getElementById("nextPageLink");
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
    if (previousPageButton !== null) {
        previousPageButton.addEventListener("click", function(e) {
            e.preventDefault();
            let query = previousPageButton.getAttribute("href");
            handlePagination(query);
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {
    // Dispatch a custom event that will tell all required modules to initialise
    document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));
});