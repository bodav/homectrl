"use strict";

let winston = require("winston");
let express = require("express");
let exphbs = require("express-handlebars");
let util = require("util");

module.exports.initialize = (bus, config, app) => {
    winston.info("initializing web plugin...");

    app.engine("handlebars", exphbs({
        defaultLayout: "layout",
        layoutsDir: "plugins/web/views"
    }));
    app.set("view engine", "handlebars");
    app.set('views', "plugins/web/views")

    app.use("/static", express.static("plugins/web/static"));

    app.get("/", function (req, res) {
        res.render("home", {
            viewTitle: "Event Client",
            isHome: true
        });
    });

    app.get("/log", function (req, res) {
        winston.query({
            json: true,
            order: "asc"
        }, function (err, results) {
            res.render("log", {
                viewTitle: "Live log",
                isHome: false,
                logs: results.buffer,
                plugins: getPluginInfos()
            });
        });
    });

    winston.info("web plugin initialized");
}

module.exports.info = () => {
    return {
        name: "Web"
    }
};

module.exports.destroy = () => {
    winston.info("Web plugin destroyed");
};