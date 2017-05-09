"use strict";

let winston = require("winston");
let sonos = require('sonos');

let sonosDevice = null;
let searching = false;

let defaultTrack = null;

module.exports.initialize = (bus, config) => {
    winston.info("Initializing Sonos plugin...");

    defaultTrack = config.defaultSonosPlayUri;

    startDeviceSearch();

    bus.on("sonos.play", (payload) => {
        winston.verbose("[Event][sonos.play]: " + payload);
        play();
    });

    bus.on("sonos.pause", (payload) => {
        winston.verbose("[Event][sonos.pause]: " + payload);
        pause();
    });

    bus.on("hue.sensor.SonosPlayState.changed", (state) => {
        winston.verbose("[Event][hue.sensor.SonosPlayState.changed]: " + state);
        togglePlay();
    });

    winston.info("Sonos plugin initialized");
};

function togglePlay() {
    sonosDevice.getCurrentState((err, state) => {
        if(err != null) {
            winston.error("sonos.getCurrentState: " + err);
            return;
        }

        winston.verbose("Current sonos speaker state is: " + state);
        
        switch(state) {
            case "playing":
                pause();
                break;

            case "paused":
                play();
                break;

            case "stopped":
                play();
                break;
        }
    });
}

function play() {
    if (sonosDevice == null) {
        startDeviceSearch();
        return;
    }

    winston.verbose("playing sonos speaker");

    sonosDevice.currentTrack((err, track) => {
        if (err != null) {
            winston.error("sonos.currentTrack: " + err);
            startDeviceSearch();
            return;
        }

        winston.verbose("Current sonos speaker track is: " + track.uri);

        let uri = undefined;

        if(track.uri === "") {
            winston.verbose("no current track, playing default");
            uri = defaultTrack;
        } else {
            winston.verbose("speaker already has a current track. Playing that then...");
        }

        sonosDevice.play(uri, (err, playing) => {
            if (err != null) {
                winston.error("sonos.play: " + err);
                startDeviceSearch();
                return;
            }

            winston.verbose("Response from sonos speaker (playing?): " + playing);
        });
    });
}

function pause() {
    if (sonosDevice == null) {
        startDeviceSearch();
        return;
    }

    winston.verbose("pausing sonos speaker");

    sonosDevice.pause((err, paused) => {
        if (err != null) {
            winston.error("sonos.pause:" + err);
            startDeviceSearch();
            return;
        }

        winston.verbose("Response from sonos speaker (paused?): " + paused);
    });
}

function startDeviceSearch() {
    if (searching) {
        winston.warn("Already searching for Sonos devices! Aborting new device search");
        return;
    }

    winston.verbose("Starting sonos device search");
    let search = sonos.search();
    searching = true;

    search.on("DeviceAvailable", (device, model) => {
        winston.verbose("Found sonos device");
        device.getZoneAttrs((err, info) => {
            winston.verbose("Sonos device name: " + info.CurrentZoneName);
            if (info.CurrentZoneName == "Køkken") {
                winston.verbose("Found 'Køkken' sonos device. Stopping device search");
                sonosDevice = device;
                search.destroy();
                searching = false;
            } else {
                winston.verbose("Ignoring device");
            }
        });
    });

    setTimeout(() => {
        if (searching) {
            winston.verbose("Stopping Sonos device search");
            search.destroy();
        }
    }, 15000);
}