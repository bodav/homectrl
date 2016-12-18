"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOMContentLoaded");

    let wsLog = getLogSocket();
    let container = document.getElementById("logsContainer");

    wsLog.onopen = () => {
        console.log("socket opened");
        setAlertConnected();
    };

    wsLog.onmessage = (evt) => {
        let data = JSON.parse(evt.data);
        let wrapper = document.createElement("div");
        wrapper.innerText = formatLog(data[0]);

        container.appendChild(wrapper);
    };

    wsLog.onclose = () => {
        console.log("socket closed");
        setAlertDisconnected();
    };
});