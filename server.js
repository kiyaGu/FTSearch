const express = require("express");
const path = require("path");
var exphbs = require("express-handlebars");
const ftSearchHomeController = require("./controllers/ftSearchHomeController");
const ftSearchHeadlinesController = require("./controllers/ftSearchHeadlinesController");

const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    ftSearchHomeController(req, res);
});
app.get("/search", (req, res) => {
    ftSearchHeadlinesController(req, res);
});

module.exports = app;
if (!module.parent) {
    app.listen(process.env.PORT || 3333, () => {
        console.log("Server is listening on port 3333. Ready to accept requests!");
    });
}