"use strict";

let winston = require("winston");
let express = require("express");

module.exports.initialize = function (app, emitter) {
    winston.info("initializing web plugin...");

    app.use(express.static('plugins/web/public'));

    // app.get("/", function (req, res) {
    //     res.redirect("/public/index.html");
    // });
    //message.appendTo($('body')).fadeIn(300).delay(3000).fadeOut(500);

    winston.info("web plugin initialized");
}