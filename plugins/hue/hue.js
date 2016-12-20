"use strict";

let huejay = require('huejay');
let winston = require("winston");

module.exports.initialize = (eventBus, config) => {
    winston.info("initializing hue plugin...");
    discoverBridge(eventBus, config.hueUserKey);
    winston.info("hue plugin initialized");
};

function createBridgeClient(ip, hueUserKey) {
    let client = new huejay.Client({
        host: ip,
        username: hueUserKey,
    });
    return client;
}

function discoverBridge(eventBus, hueUserKey) {
    huejay.discover()
        .then(bridges => {
            if (bridges.length > 0) {
                let bridge = bridges[0];
                winston.debug("Hue Bridge found with ip: " + bridge.ip);
                let client = createBridgeClient(bridge.ip, hueUserKey);
                initEvents(client, eventBus);
            }
        })
        .catch(error => {
            winston.error(`An discover error occurred: ${error.message}`);
        });
}

function initEvents(client, eventBus) {
    winston.info("Initializing Hue events...");

    setInterval(() => {
        pollSensorSonosPlayState(client, eventBus);
    }, 2000);

    winston.info("hue events initialized");
}

let sonosPlayStateSensorId = 5;
let lastFlagState = false;
let lastUpdated = null;

function pollSensorSonosPlayState(client, eventBus) {
    winston.debug("polling SonosPlayState sensor");

    client.sensors.getById(5)
        .then(sensor => {
            let flagState = sensor.state.attributes.attributes.flag;
            let timestamp = sensor.state.attributes.attributes.lastupdated;

            if (lastUpdated == null) {
                winston.debug("First time polling SonosPlayState sensor, updating local variables");
                lastFlagState = flagState;
                lastUpdated = timestamp;
            } else if (lastFlagState != flagState && lastUpdated != timestamp) {
                winston.debug("SonosPlayState sensor updated!");
                lastFlagState = flagState;
                lastUpdated = timestamp;

                eventBus.emit("hue.sensor.sonosplaystate", flagState);
            }
        })
        .catch(error => {
            winston.error('Could not find SonosPlayState sensor');
            winston.error(error);
        });
}