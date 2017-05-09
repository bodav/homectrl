"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    let ws = new WebSocket("ws://" + location.host + "/eventbus");

    let btnSend = document.getElementById("btnSend");
    let eventInput = document.getElementById("eventInput");

    btnSend.addEventListener("click", () => {
        let eventName = eventInput.value;
        let payload = payloadInput.value;

        if (eventName != "") {
            ws.send(JSON.stringify({
                "event": eventName,
                "payload": payload
            }));
        }
    }, true);

    ws.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        addEventLogItem(data);
    };

    ws.onopen = () => {
        console.log("socket opened");
        setBadgeConnected();
    };

    ws.onclose = () => {
        console.log("socket closed");
        setBadgeDisconnected();
    };
});

function addEventLogItem(item) {
    $("#eventLog tr:last")
        .after(`<tr><td>${item.event}</td><td>${JSON.stringify(item.payload)}</td></tr>`);
}