"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    let wsLog = new WebSocket("ws://" + location.host + "/winston");

    wsLog.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        addLogItem(data[0]);
    };

    wsLog.onopen = () => {
        console.log("socket opened");
        setBadgeConnected();
    };

    wsLog.onclose = () => {
        console.log("socket closed");
        setBadgeDisconnected();
    };
});

function addLogItem(item) {
    $("#log tr:last")
        .after(`<tr><td>${item.createdAt}</td><td>${item.level}</td><td>${item.message}</td></tr>`);
}