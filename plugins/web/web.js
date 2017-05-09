"use strict";

let winston = require("winston");
let express = require("express");
let exphbs = require("express-handlebars");
let util = require("util");

module.exports.initialize = (bus, app, config) => {
    winston.info("initializing web plugin...");
    initViewEngine(app);
    initRoutes(app, bus, config);
    winston.info("web plugin initialized");
}

function getEventListeners(bus) {
    let listeners = Object.keys(bus["_events"]).filter(key => key != "maxListeners");
    return listeners;
}

function initViewEngine(app) {
    app.engine("handlebars", exphbs({
        defaultLayout: "layout",
        layoutsDir: "plugins/web/views"
    }));
    app.set("view engine", "handlebars");
    app.set('views', "plugins/web/views")

    app.use("/static", express.static("plugins/web/static"));
}

function initRoutes(app, bus, config) {
    let events = getEventListeners(bus);

    app.get("/", function (req, res) {
        res.render("home", {
            viewTitle: "Event Client",
            events: events
        });
    });

    app.get("/config", function (req, res) {
        res.render("config", {
            viewTitle: "Configuration",
            events: events,
            config: config
        });
    });

    app.get("/log", function (req, res) {
        winston.query({
            json: true,
            order: "asc"
        }, function (err, results) {
            res.render("log", {
                viewTitle: "Live log",
                events: events,
                logs: results.buffer
            });
        });
    });
}