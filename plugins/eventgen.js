"use strict";

let winston = require("winston");
let util = require("util");

module.exports.initialize = function (httpServer, emitter) {
    winston.info("initializing eventgen plugin...");

    setInterval(() => {
        winston.debug("[eventgen]: heartbeat");
        emitter.emit("message", "testpayload");
    }, 5000);

    emitter.on("message", (data) => {
        winston.debug("[eventgen]: Received event. Data: " + util.inspect(data));
    });

    winston.info("eventgen plugin initialized");
}