"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
    $("#navbar a[href='" + window.location.pathname + "']")
        .parent()
        .addClass("active");

    if(window.location.pathname === "/config") {
        hideConnectionBadge();
    }
});

function hideConnectionBadge() {
    $("#badgeConnectionStatus").hide();
}

function setBadgeConnected() {
    $("#badgeConnectionStatus")
        .removeClass("badge-danger")
        .addClass("badge-success");
}

function setBadgeDisconnected() {
    $("#badgeConnectionStatus")
        .removeClass("badge-success")
        .addClass("badge-danger");
}