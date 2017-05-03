"use strict";

let winston = require("winston");

module.exports.initialize = (bus) => {
    winston.info("Initializing Echo plugin...");

    bus.on("echo.ping", (payload) => {
        winston.debug("[Event][echo.ping]: " + payload);
        bus.emit("echo.pong", payload);
    });

    winston.info("Echo plugin initialized");
};