"use strict";

let huejay = require('huejay');
let winston = require("winston");

module.exports.initialize = (bus, config, http) => {
    winston.info("Initializing Hue plugin...");
    discoverBridge(bus, config.hueUserKey);
    winston.info("Hue plugin initialized");
};

function discoverBridge(bus, hueUserKey) {
    huejay.discover()
        .then((bridges) => {
            if (bridges.length > 0) {
                let bridge = bridges[0];
                winston.debug("Hue Bridge found with ip: " + bridge.ip);
                let client = createBridgeClient(bridge.ip, hueUserKey);
                initEvents(client, bus);
            } else {
                winston.debug("No hue bridges found!");
            }
        })
        .catch((error) => {
            winston.error("Error discovering Hue bridges!");
            winston.error(error);
        });
}

function createBridgeClient(ip, hueUserKey) {
    let client = new huejay.Client({
        host: ip,
        username: hueUserKey,
    });
    return client;
}

function initEvents(client, bus) {
    winston.info("Initializing Hue events...");

    setInterval(() => {
        pollSensorSonosPlayState(client, bus);
    }, 5000);

    winston.info("Hue events initialized");
}

let sonosPlayStateSensorId = 5;
let lastFlagState = false;
let lastUpdated = null;

function pollSensorSonosPlayState(client, bus) {
    winston.debug("Polling Hue sensor with id: " + sonosPlayStateSensorId);
    client.sensors.getById(5)
        .then(sensor => {
            let flagState = sensor.state.attributes.attributes.flag;
            let timestamp = sensor.state.attributes.attributes.lastupdated;

            winston.debug("Sensor flag state: " + flagState);
            winston.debug("Sensor timestamp: " + timestamp);

            if (lastUpdated == null) {
                winston.debug("First time polling SonosPlayState sensor, updating local variables");
                lastFlagState = flagState;
                lastUpdated = timestamp;
            } else if (lastFlagState != flagState && lastUpdated != timestamp) {
                winston.debug("Hue SonosPlayState sensor updated!");
                lastFlagState = flagState;
                lastUpdated = timestamp;

                bus.emit("hue.sensor.SonosPlayState.changed", flagState);
            }
        })
        .catch(error => {
            winston.error("Could not find SonosPlayState sensor");
            winston.error(error);
        });
}

module.exports.info = () => {
    return {
        name: "Hue",
        capabilities: [{
            event: "hue.sensor.SonosPlayState.changed",
            direction: "emitting",
            payload: "State: true/false"
        }]
    }
};

module.exports.destroy = () => {
    winston.info("Hue plugin destroyed");
};