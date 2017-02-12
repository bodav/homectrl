"use strict";

let winston = require("winston");
let express = require("express");
let exphbs = require("express-handlebars");

module.exports.initialize = (app, bus) => {
    winston.info("initializing web plugin...");

    app.engine("handlebars", exphbs({
        defaultLayout: "layout",
        layoutsDir: "plugins/web/views"
    }));
    app.set("view engine", "handlebars");
    app.set('views', "plugins/web/views")

    app.use("/static", express.static("plugins/web/static"));

    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/log", function (req, res) {
        res.render("log");
    });

    app.get("/events", function (req, res) {
        res.render("events");
    });

    bus.on("plugin.info", () => {
        bus.emit("plugin.info.web", {
            name: "Web"
        });
    });

    winston.info("web plugin initialized");
}

// var options = {
//     json: true,
//     order: 'asc'
// };

// winston.query(options, function (err, results) {
//     // Check err, handle results array
//     console.log(results);
// });