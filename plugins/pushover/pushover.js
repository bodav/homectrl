"use strict";

let winston = require("winston");
let chump = require('chump');

let client = null;
let user = null;

module.exports.initialize = (bus, config, http) => {
    winston.info("Initializing Pushover plugin...");

    client = new chump.Client(config.pushoverAppKey);
    user = new chump.User(config.pushoverUserKey);

    bus.on("pushover.notify", (payload) => {
        winston.debug("[Event][pushover.notify]: " + payload);
        let msg = createMessage(payload);

        client.sendMessage(msg)
            .then(() => {
                winston.debug("Pushover message sent");
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

module.exports.info = () => {
    return {
        name: "Pushover",
        capabilities: [{
            event: "pushover.notify",
            direction: "listening",
            payload: "str: message"
        }]
    }
};

module.exports.destroy = () => {
    winston.info("Pushover plugin destroyed");
};