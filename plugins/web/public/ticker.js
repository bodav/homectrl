"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOMContentLoaded");

    let wsLog = getLogSocket();
    let wsEvent = getEventSocket();

    let logTicker = document.getElementById("logTicker");
    let eventTicker = document.getElementById("eventTicker");

    wsLog.onopen = () => {
        console.log("socket opened");
        setAlertConnected();
    };

    wsLog.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        logTicker.innerText = formatLog(data[0]);
    };

    wsEvent.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        eventTicker.innerText = formatEvent(data);
    };

    wsLog.onclose = () => {
        console.log("socket closed");
        setAlertDisconnected();
    };
});