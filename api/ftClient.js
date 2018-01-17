require("es6-promise").polyfill();
require("isomorphic-fetch");

module.exports = function(keyword, maxResult, offsetN) {
    return new Promise(function(resolve, reject) {
        fetch("http://api.ft.com/content/search/v1", {
                method: "POST",
                headers: {
                    "X-Api-Key": process.env.FTAPIKEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    queryString: keyword,
                    queryContext: {
                        curations: ["ARTICLES", "BLOGS"]
                    },
                    resultContext: {
                        maxResults: maxResult,
                        offset: offsetN,
                        contextual: true,
                        aspects: [
                            "title",
                            "summary",
                            "editorial",
                            "location",
                            "metadata",
                            "lifecycle"
                        ]
                    }
                })
            })
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error("The resource is not found");
                }
                return response.json();
            })
            .then(function(response) {
                resolve(response);
            });
    });
};