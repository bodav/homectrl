'use strict'

let winston = require("winston");
let gpio = require('rpi-gpio');

let changeThrottle = false;

module.exports.initialize = (bus, config) => {
    winston.info("Initializing Doorbell plugin...");

    gpio.setup(config.doorbellGpioPin, gpio.DIR_IN, gpio.EDGE_RISING, (err) => {
        if (err != undefined) {
            winston.error("Error setting up gpio pin: " + config.doorbellGpioPin);
            winston.error(err);
        }

        gpio.on("change", (channel, val) => {
            if (!changeThrottle) {
                changeThrottle = true;
                winston.verbose("Doorbell plugin - Got rising edge event");

                bus.emit("doorbell.activated", {
                    pin: channel,
                    value: val
                });

                bus.emit("pushover.notify", "Doorbell activated");

                setTimeout(() => {
                    winston.verbose("Doorbell plugin - Resetting gpio change event throttle flag");
                    changeThrottle = false;
                }, 4500);
            }
        });
    });

    winston.info("Doorbell plugin initialized");
};