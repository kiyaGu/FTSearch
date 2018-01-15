const express = require("express");
const path = require("path");
var exphbs = require("express-handlebars");
const formidable = require("express-formidable");
require("es6-promise").polyfill();
require("isomorphic-fetch");

const ftSearchController = require("./controllers/ftSearchController");
const ftSearchHeadlinesController = require("./controllers/ftSearchHeadlinesController");

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
    ftSearchController(res);
});
app.get("/search", (req, res) => {
    ftSearchHeadlinesController(req, res);
});

app.listen(3000, () => {
    console.log("server running at localhost:3000");
});