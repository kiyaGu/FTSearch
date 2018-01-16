const express = require("express");
const path = require("path");
var exphbs = require("express-handlebars");
const formidable = require("express-formidable");
const ftSearchHomeController = require("./controllers/ftSearchHomeController");
const ftSearchHeadlinesController = require("./controllers/ftSearchHeadlinesController");
const moment = require("moment");
const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(formidable());

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    ftSearchHomeController(req, res);
});
app.get("/search", (req, res) => {
    ftSearchHeadlinesController(req, res);
});

app.listen(3000, () => {
    console.log("server running at localhost:3000");
});