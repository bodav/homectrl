"use strict";

let winston = require("winston");
let express = require("express");

module.exports.initialize = (app, emitter) => {
    winston.info("initializing web plugin...");

    app.use(express.static('plugins/web/public'));

    // app.get("/", function (req, res) {
    //     res.redirect("/public/index.html");
    // });

    winston.info("web plugin initialized");
}