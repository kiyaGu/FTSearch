const express = require("express");
const path = require("path");
var exphbs = require("express-handlebars");
const formidable = require("express-formidable");
require("es6-promise").polyfill();
require("isomorphic-fetch");

const moment = require("moment");
moment().format();

const app = express();
const hbs = exphbs.create({
    /* config */
});

app.use(express.static(path.join(process.cwd(), "/public")));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(formidable());

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    fetch("http://api.ft.com/content/search/v1", {
            method: "POST",
            headers: {
                "X-Api-Key": "59cbaf20e3e06d3565778e7bbfc218a2dde8436ba6af7ed77d5afa7e",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                queryString: "",
                queryContext: {
                    curations: ["ARTICLES"]
                },
                resultContext: {
                    maxResults: 9,
                    offset: 0,
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
            let articles = [];
            response.results[0].results.forEach(article => {
                articles.push({
                    keyword: "latest",
                    title: article.title.title,
                    author: article.editorial.byline,
                    excerpt: article.summary.excerpt,
                    publicationDate: moment(
                        article.lifecycle.initialPublishDateTime
                    ).format("dddd, Do MMMM, YYYY"),
                    link: article.location.uri,
                    tag: article.metadata.primarySection.term.name,
                    tagLink: `https://www.ft.com/${article.metadata.primarySection.term.name.toLowerCase()}`
                });
            });

            res.render("home", { articles: articles });
        });
});
app.post("/search", (req, res) => {
    let nextPage;
    if (
        parseInt(req.fields.currentPageNumber) !==
        parseInt(req.fields.totalPageNumber) &&
        parseInt(req.fields.currentPageNumber) + 2 < 200
    ) {
        nextPage = parseInt(req.fields.currentPageNumber) + 2;
    } else {
        nextPage = req.fields.currentPageNumber;
    }

    let currentPage =
        parseInt(req.fields.currentPageNumber) !=
        parseInt(req.fields.totalPageNumber) &&
        parseInt(req.fields.currentPageNumber) + 1 < 200 ?
        parseInt(req.fields.currentPageNumber) + 1 :
        req.fields.currentPageNumber;
    fetch("http://api.ft.com/content/search/v1", {
            method: "POST",
            headers: {
                "X-Api-Key": "59cbaf20e3e06d3565778e7bbfc218a2dde8436ba6af7ed77d5afa7e",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                queryString: req.fields.keyword,
                queryContext: {
                    curations: ["ARTICLES"]
                },
                resultContext: {
                    maxResults: 20,
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
            let articles = [];
            response.results[0].results.forEach(article => {
                articles.push({
                    previousPage: 1,
                    currentPage: 1,
                    nextPage: response.results[0].indexCount > 20 ? 2 : 1,
                    totalNumberOfPages: response.results[0].indexCount < 4000 ?
                        response.results[0].indexCount > 20 ?
                        Math.ceil(response.results[0].indexCount / 20) :
                        1 :
                        200,
                    keyword: response.query.queryString,
                    title: article.title.title,
                    author: article.editorial.byline,
                    excerpt: article.summary.excerpt,
                    publicationDate: moment(
                        article.lifecycle.initialPublishDateTime
                    ).format("dddd, Do MMMM, YYYY"),
                    link: article.location.uri,
                    tag: article.metadata.primarySection.term.name,
                    tagLink: `https://www.ft.com/${article.metadata.primarySection.term.name.toLowerCase()}`
                });
            });

            res.render("articles", { articles: articles });
        });
});
app.get("/page", (req, res) => {
    let keyword = req.query.q;
    let currentPage = parseInt(req.query.page);

    let offset;
    if (currentPage >= 1 && currentPage <= 200) {
        offset = (currentPage - 1) * 20;
    }
    fetch("http://api.ft.com/content/search/v1", {
            method: "POST",
            headers: {
                "X-Api-Key": "59cbaf20e3e06d3565778e7bbfc218a2dde8436ba6af7ed77d5afa7e",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                queryString: keyword,
                queryContext: {
                    curations: ["ARTICLES"]
                },
                resultContext: {
                    maxResults: 20,
                    offset: offset,
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
            let articles = [];
            let totalNumberOfPages =
                response.results[0].indexCount < 4000 ?
                response.results[0].indexCount > 20 ?
                Math.ceil(response.results[0].indexCount / 20) :
                1 :
                200;

            response.results[0].results.forEach(article => {
                articles.push({
                    previousPage: currentPage - 1 >= 1 ? currentPage - 1 : 1,
                    currentPage: currentPage,
                    nextPage: currentPage + 1 > totalNumberOfPages ?
                        currentPage :
                        currentPage + 1,
                    totalNumberOfPages: totalNumberOfPages,
                    keyword: keyword,
                    title: article.title.title,
                    author: article.editorial.byline,
                    excerpt: article.summary.excerpt,
                    publicationDate: moment(
                        article.lifecycle.initialPublishDateTime
                    ).format("dddd, Do MMMM, YYYY"),
                    link: article.location.uri,
                    tag: article.metadata.primarySection.term.name,
                    tagLink: `https://www.ft.com/${article.metadata.primarySection.term.name.toLowerCase()}`
                });
            });
            res.render("articles", { articles: articles });
        });
});

app.listen(3000, () => {
    console.log("server running at localhost:3000");
});