"use strict";

let winston = require("winston");
let express = require("express");

module.exports.initialize = (app, bus) => {
    winston.info("initializing web plugin...");

    bus.on("plugin.info", () => {
        bus.emit("plugin.info.web", {
            name: "Web"
        });
    });

    app.use(express.static('plugins/web/public'));

    // app.get("/", function (req, res) {
    //     res.redirect("/public/index.html");
    // });

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