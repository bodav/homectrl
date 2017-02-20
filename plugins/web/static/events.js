"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOMContentLoaded");

    let ws = getEventSocket();
    let container = document.getElementById("eventContainer");

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

    ws.onopen = () => {
        console.log("socket opened");
        setBadgeConnected();
    };

    ws.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        let wrapper = document.createElement("div");
        wrapper.innerText = formatEvent(data);

        container.appendChild(wrapper);
    };

    ws.onclose = () => {
        console.log("socket closed");
        setBadgeDisconnected();
    };
});