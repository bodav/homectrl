"use strict";

let winston = require("winston");
let util = require("util");

module.exports.initialize = function (emitter) {
    winston.info("initializing eventgen plugin...");

    setInterval(() => {
        emitter.emit("eventgen.testevent", "testpayload");
    }, 5000);

    emitter.on("eventgen.*", (data) => {
        winston.debug("[eventgen]: Received event. Data: " + util.inspect(data));
    });

    winston.info("eventgen plugin initialized");
}