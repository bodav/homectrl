"use strict";

let winston = require("winston");
let chump = require('chump');

let client = null;
let user = null;

module.exports.initialize = (bus, config) => {
    winston.info("Initializing Pushover plugin...");

    bus.on("plugin.info", () => {
        bus.emit("plugin.info.pushover", {
            name: "Pushover"
        });
    });

    client = new chump.Client(config.pushoverAppKey);
    user = new chump.User(config.pushoverUserKey);

    bus.on("pushover.notify", (payload) => {
        winston.debug("[Event][pushover.notify]: " + payload);
        //console.log(JSON.parse(payload));
        let msg = createMessage(payload.message);

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