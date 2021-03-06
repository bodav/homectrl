"use strict";

let winston = require("winston");
let chump = require('chump');

let client = null;
let user = null;

module.exports.initialize = (bus, config) => {
    winston.info("Initializing Pushover plugin...");

    client = new chump.Client(config.pushoverAppKey);
    user = new chump.User(config.pushoverUserKey);

    bus.on("pushover.notify", (payload) => {
        winston.verbose("[Event][pushover.notify]: " + payload);
        let msg = createMessage(payload);

        client.sendMessage(msg)
            .then(() => {
                winston.verbose("Pushover message sent");
            })
            .catch((error) => {
                winston.error("Error sending pushover message!");
                winston.error(error);
            });
    });

    winston.info("Pushover plugin initialized");
};

function createMessage(msg) {
    let m = new chump.Message({
        title: "HomeCtrl",
        message: msg,
        enableHtml: false,
        user: user,
        priority: new chump.Priority("normal")
    });

    return m;
}