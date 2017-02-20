"use strict";

function formatLog(log) {
    return `[${log.createdAt}][${log.level}]: ${log.message}`;
}

function formatEvent(event) {
    return `[Event:${event.event}][Payload]: ${JSON.stringify(event.payload)}`;
}

function getLogSocket() {
    return new WebSocket("ws://" + location.host + "/winston");
}

function getEventSocket() {
    return new WebSocket("ws://" + location.host + "/eventbus");
}

function setBadgeConnected() {
    let badge = document.getElementById("badgeConnectionStatus");

    if (badge != null) {
        badge.className = "badge badge-success";
        badge.innerText = "Connected";
    }
}

function setBadgeDisconnected() {
    let badge = document.getElementById("badgeConnectionStatus");

    if (badge != null) {
        badge.className = "badge badge-danger";
        badge.innerText = "Disconnected";
    }
}