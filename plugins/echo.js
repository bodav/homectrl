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

module.exports.destroy = () => {
    winston.info("Echo plugin destroyed");
};

module.exports.info = () => {
    return {
        name: "Echo",
        capabilities: [{
                event: "echo.ping",
                direction: "listening",
                payload: "any"
            },
            {
                event: "echo.pong",
                direction: "emitting",
                payload: "any"
            }
        ]
    }
};