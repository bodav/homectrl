"use strict";

let winston = require("winston");
let sonos = require('sonos');

let sonosDevice = null;
let searching = false;

module.exports.initialize = (bus) => {
    winston.info("Initializing Sonos plugin...");

    bus.on("plugin.info", () => {
        bus.emit("plugin.info.sonos", {
            name: "Sonos"
        });
    });

    startDeviceSearch();

    bus.on("sonos.play", (payload) => {
        winston.debug("[Event][sonos.play]: " + payload);
        play();
    });

    bus.on("sonos.pause", (payload) => {
        winston.debug("[Event][sonos.pause]: " + payload);
        pause();
    });

    bus.on("sonos.togglePlay", (payload) => {
        winston.debug("[Event][sonos.togglePlay]: " + payload);
        togglePlay();
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

function togglePlay() {
    if (sonosDevice == null) {
        startDeviceSearch();
        return;
    }

    sonosDevice.getCurrentState((err, state) => {
        if (err != null) {
            winston.error("sonos.togglePlay:" + err);
            startDeviceSearch();
            return;
        }

        if (state == "playing") {
            pause();
        } else if (state == "stopped") {
            play();
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