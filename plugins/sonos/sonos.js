"use strict";

let winston = require("winston");
let sonos = require('sonos');

let sonosDevice = null;
let searching = false;

module.exports.initialize = (bus, config, http) => {
    winston.info("Initializing Sonos plugin...");

    startDeviceSearch();

    bus.on("sonos.play", (payload) => {
        winston.debug("[Event][sonos.play]: " + payload);
        play();
    });

    bus.on("sonos.pause", (payload) => {
        winston.debug("[Event][sonos.pause]: " + payload);
        pause();
    });

    bus.on("hue.sensor.SonosPlayState.changed", (state) => {
        winston.debug("[Event][hue.sensor.SonosPlayState.changed]: " + payload);
        if (state) {
            play();
        } else {
            pause();
        }
    });

    winston.info("Sonos plugin initialized");
};

function play() {
    if (sonosDevice == null) {
        startDeviceSearch();
        return;
    }

    sonosDevice.play((err, data) => {
        if (err != null) {
            winston.error("sonos.play:" + err);
            startDeviceSearch();
            return;
        }
    });
}

function pause() {
    if (sonosDevice == null) {
        startDeviceSearch();
        return;
    }

    sonosDevice.pause((err, data) => {
        if (err != null) {
            winston.error("sonos.pause:" + err);
            startDeviceSearch();
            return;
        }
    });
}

function startDeviceSearch() {
    if (searching) {
        winston.warn("Already searching for Sonos devices! Aborting new device search");
        return;
    }

    winston.debug("Starting sonos device search");
    let search = sonos.search();
    searching = true;

    search.on("DeviceAvailable", (device, model) => {
        winston.debug("Found sonos device");
        device.getZoneAttrs((err, info) => {
            winston.debug("Sonos device name: " + info.CurrentZoneName);
            if (info.CurrentZoneName == "Køkken") {
                winston.debug("Found 'Køkken' sonos device. Stopping device search");
                sonosDevice = device;
                search.destroy();
                searching = false;
            } else {
                winston.debug("Ignoring device");
            }
        });
    });

    setTimeout(() => {
        if (searching) {
            winston.debug("Stopping Sonos device search");
            search.destroy();
        }
    }, 15000);
}

module.exports.info = () => {
    return {
        name: "Sonos",
        capabilities: [{
                event: "sonos.play",
                direction: "listening",
                payload: "None"
            },
            {
                event: "sonos.pause",
                direction: "listening",
                payload: "None"
            },
            {
                event: "hue.sensor.SonosPlayState.changed",
                direction: "listening",
                payload: "state"
            },
        ]
    }
};

module.exports.destroy = () => {
    winston.info("Sonos plugin destroyed");
};