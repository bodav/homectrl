"use strict";

let winston = require("winston");
let sonos = require('sonos');

let sonosDevice = null;
let searching = false;

module.exports.initialize = (emitter) => {
    winston.info("initializing sonos plugin...");

    startDeviceSearch();

    emitter.on("sonos.play", (payload) => {
        play();
    });

    emitter.on("sonos.pause", (payload) => {
        pause();
    });

    emitter.on("sonos.togglePlay", (payload) => {
        togglePlay();
    });

    winston.info("sonos plugin initialized");
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
        winston.warn("already searching");
        return;
    }

    winston.debug("Starting sonos device search");
    let search = sonos.search();
    searching = true;

    search.on("DeviceAvailable", (device, model) => {
        winston.debug("Found sonos device");
        device.getZoneAttrs((err, info) => {
            if (info.CurrentZoneName == "Køkken") {
                winston.debug("Found 'Køkken' sonos device. Stopping device search");
                sonosDevice = device;
                search.destroy();
                searching = false;
            }
        });
    });

    setTimeout(() => {
        if (searching) {
            winston.debug("Stopping device search");
            search.destroy();
        }
    }, 15000);
}