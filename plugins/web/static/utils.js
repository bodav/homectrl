"use strict";

function formatLog(log) {
    return `[${log.createdAt}][${log.level}]: ${log.message}`;
}

function formatEvent(event) {
    return `[Event:${event.event}][Payload]: ${JSON.stringify(event.payload)}`;
}

function getLogSocket() {
    return new WebSocket("ws://" + location.host + "/logs");
}

function getEventSocket() {
    return new WebSocket("ws://" + location.host + "/events");
}

function setAlertConnected() {
    let connectionStatusAlert = document.getElementById("connectionStatusAlert");
    let connectionStatusLabel = document.getElementById("connectionStatusLabel");

    if (connectionStatusAlert != null) {
        connectionStatusAlert.className = "alert alert-success";
        connectionStatusLabel.innerText = "Connected!";
    }
}

function setAlertDisconnected() {
    let connectionStatusAlert = document.getElementById("connectionStatusAlert");
    let connectionStatusLabel = document.getElementById("connectionStatusLabel");

    if (connectionStatusAlert != null) {
        connectionStatusAlert.className = "alert alert-danger";
        connectionStatusLabel.innerText = "Not Connected!";
    }
}