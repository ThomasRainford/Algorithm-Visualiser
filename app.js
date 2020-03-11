const express = require("express");

const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/pathfinding.html");
});


app.listen(3000, function () {
    console.log("Server Running");
});