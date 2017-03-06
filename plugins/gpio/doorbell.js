"use strict";

let winston = require("winston");
let gpio = require('rpi-gpio');

const INPUTPIN = 7;

let changeThrottle = false;

module.exports.initialize = (bus, config, http) => {
    winston.info("Initializing Doorbell plugin...");

    gpio.setup(INPUTPIN, gpio.DIR_IN, gpio.EDGE_RISING, (err) => {
        if (err != undefined) {
            winston.error("Error setting up gpio pin: " + INPUTPIN);
            winston.error(err);
        }

        gpio.on("change", (channel, val) => {
            if (!changeThrottle) {
                changeThrottle = true;
                winston.debug("Doorbell plugin - Got rising edge event");

                bus.emit("doorbell.activated", {
                    pin: channel,
                    value: val
                });

                bus.emit("pushover.notify", "Doorbell activated");

                setTimeout(() => {
                    winston.debug("Doorbell plugin - Resetting event throttle flag");
                    changeThrottle = false;
                }, 4500);
            }
        });
    });

    winston.info("Doorbell plugin initialized");
};

module.exports.destroy = () => {
    winston.info("Destroying Doorbell plugin");
    gpio.destroy();
    winston.info("Doorbell plugin destroyed!");
};

module.exports.info = () => {
    return {
        name: "GPIO-Doorbell",
        capabilities: [{
            event: "Doorbell",
            direction: "emitting",
            payload: "None"
        }]
    }
};