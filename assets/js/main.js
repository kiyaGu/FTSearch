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
    let idb = require("./../lib/idb");
    (function() {
        //check for support
        if (!("indexedDB" in window)) {
            console.log("This browser doesn't support IndexedDB");
            return;
        }
    })();

    const handlePagination = query => {
        let url = `/search${query}`;
        let q = getParameterByName("q", url);
        let fallbackUrl = `/search?q=${q}&page=1`;
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

                    if (contentType.indexOf("application/json") !== -1) {
                        //if the returned reponse is
                        response.json().then(resp => {
                            creatOrLoadDB()
                                .then(dbPromise => {
                                    //we can safely assume that when .then executes, the database is open and all object stores and indexes are ready for use
                                    //save or update the response locally
                                    saveDataToDB(dbPromise, resp, url);
                                })
                                .then(function() {
                                    //update the view
                                    updateThePage(resp);
                                });
                        });
                    }
                })
                .catch(error => {
                    //if no reponse from ntwk or error
                    //fallback to the first page of the current search
                    creatOrLoadDB().then(dbPromise => {
                        readSingleDataFromDB(dbPromise, fallbackUrl)
                            .then(data => {
                                if (data) {
                                    // update the view with the first page data page and the user can naviagte again
                                    //with the data saved locally changing the view with each navigation
                                    updateThePage(data);
                                }
                            })
                            .catch(error => {
                                console.log("Error:" + error);
                            });
                    });
                });
        } else {
            let request = Ajax_request();
            /* fetch the articles/news using XMLHttpRequest/AJAX*/
            (function() {
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        // check if a response was sent back
                        if (request.status === 200) {
                            // check if request was successful
                            let response = JSON.parse(request.response);
                            creatOrLoadDB().then(dbPromise => {
                                //save or update the response locally
                                saveDataToDB(dbPromise, response, url);
                                updateThePage(response);
                            });
                        } else {
                            //as a fallback if there is no more record to fetch due to
                            //network failure fallback to the first page of the current search
                            creatOrLoadDB().then(dbPromise => {
                                readSingleDataFromDB(dbPromise, fallbackUrl)
                                    .then(data => {
                                        if (data) {
                                            //data found locally => update the view
                                            updateThePage(data);
                                        }
                                    })
                                    .catch(error => {
                                        console.log("Error:" + error);
                                    });
                            });
                        }
                    }
                };

                request.open("GET", url);
                request.setRequestHeader("Content-Type", "application/json");
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

        fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                return response.json();
            })
            .then(response => {
                creatOrLoadDB().then(dbPromise =>
                    saveDataToDB(dbPromise, response, url)
                );
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
            let url = "/search" + query;
            creatOrLoadDB().then(dbPromise => {
                readSingleDataFromDB(dbPromise, url)
                    .then(data => {
                        if (data) {
                            //data found locally => update the view
                            updateThePage(data);
                        } else {
                            //data not in found locally => get it from network
                            handlePagination(query);
                        }
                    })
                    .catch(error => {
                        console.log("Error:" + error);
                    });
            });
        });
    }

    //backward
    let previousPageButton = document.getElementById("previousPageLink");
    //because they are not yet put to the DOM, need to check
    if (previousPageButton !== null) {
        previousPageButton.addEventListener("click", function(e) {
            e.preventDefault();
            let query = previousPageButton.getAttribute("href");
            let url = "/search" + query;

            creatOrLoadDB().then(dbPromise => {
                readSingleDataFromDB(dbPromise, url)
                    .then(data => {
                        if (data) {
                            //data found locally => update the view
                            updateThePage(data);
                        } else {
                            //data not in found locally => get it from network
                            handlePagination(query);
                        }
                    })
                    .catch(error => {
                        console.log("Error:" + error);
                    });
            });
        });
    }

    //save josn data to the indexDB
    function creatOrLoadDB() {
        return new Promise(function(resolve, reject) {
            let dbPromise = idb.open("FT-Search", 1, function(upgradeDb) {
                console.log("making a new object store");
                //The browser throws an error if we try to create an object store that already exists in the database
                //so we wrap the createObjectStore method in an if statement that checks if the object store exists.
                if (!upgradeDb.objectStoreNames.contains("articles")) {
                    var articlesOS = upgradeDb.createObjectStore("articles");
                    articlesOS.createIndex("keyword", "keyword", { unique: false });
                    articlesOS.createIndex("url", "url", { unique: true });
                }
                if (!upgradeDb.objectStoreNames.contains("keywords")) {
                    var logsOS = upgradeDb.createObjectStore("keywords", {
                        keyPath: "id",
                        autoIncrement: true
                    });
                }
            });
            if (dbPromise) {
                resolve(dbPromise);
            } else {
                reject(Error("Error: the database cannot be created"));
            }
        });
    }

    function saveDataToDB(dbPromise, data, url) {
        //open a transaction by calling the transaction method on the database object.
        var tx = dbPromise.transaction("articles", "readwrite");
        //open the "articles" object store on this transaction and assign it to the articles variable.
        var articles = tx.objectStore("articles");

        //returns a promise and must happen within a transaction
        articles.put(data, url);
        if (tx.complete) {
            console.log("added item to the store articles os!");
            return tx.complete;
        }
    }

    function readSingleDataFromDB(dbPromise, key) {
        //getting the database object and creating a transaction
        var tx = dbPromise.transaction("articles", "readonly");
        //open the object store on the transaction and assign the resulting object store object to the store variable
        var store = tx.objectStore("articles");
        //If you try to get an object that doesn't exist, the success handler still executes, but the result is undefined.
        return store.get(key);
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

document.addEventListener("DOMContentLoaded", function() {});