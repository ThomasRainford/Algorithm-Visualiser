const express = require("express");

const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/pathfinding", function (req, res) {
    res.sendFile(__dirname + "/pathfinding.html")
});

app.get("/sorting", function (req, res) {
    res.sendFile(__dirname + "/sorting.html")
});

app.listen(3000, function () {
    console.log("Server Running");
});