const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(process.cwd(), "/public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(3001, () => {
    console.log("server running at localhost:3001");
});