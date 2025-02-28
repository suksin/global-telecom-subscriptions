"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// Initialize Express App
var app = express();
// Import the TypeScript script dynamically
Promise.resolve().then(function () { return require("./lambdaProcessor"); }).then(function () {
    console.log("Table creation script executed successfully.");
})
    .catch(function (error) {
    console.error("Error executing table creation script:", error);
});
// Define a route that responds with 'Hello, World!' when accessed
app.get("/", function (req, res) {
    res.send("Hello, World!");
});
// Set the app to listen on port 3000
var PORT = 3000;
app.listen(PORT, function () {
    console.log("Server running at http://localhost:".concat(PORT, "/"));
});
