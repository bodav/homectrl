"use strict";

document.addEventListener("DOMContentLoaded", (event) => {

    console.log("DOMContentLoaded");

    let ws = getEventSocket();
    let container = document.getElementById("eventContainer");

    let btnSend = document.getElementById("btnSend");
    let eventInput = document.getElementById("eventInput");

    btnSend.addEventListener("click", () => {
        let value = eventInput.value;

        if (value != "") {
            ws.send(value);
        }
    }, true);

    ws.onopen = () => {
        console.log("socket opened");
        setAlertConnected();
    };

    ws.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        let wrapper = document.createElement("div");
        wrapper.innerText = formatEvent(data);

        container.appendChild(wrapper);
    };

    ws.onclose = () => {
        console.log("socket closed");
        setAlertDisconnected();
    };
});