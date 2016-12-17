"use strict";

let winston = require("winston");
let EventEmitter2 = require('eventemitter2').EventEmitter2;
let ws = require("ws");

module.exports.initialize = function (httpServer) {
    winston.info("Initializing eventbus...");

    //event router
    let emitter = new EventEmitter2();

    //external event socket
    let wsServer = new ws.Server({
        server: httpServer,
        path: "/events"
    });

    emitter.onAny((event, value) => {
        //wsServer.emit(event, value);
    });

    wsServer.on("connection", (socket) => {
        winston.debug("Event client connected");

        socket.on("message", (data) => {
            emitter.emit("message", data);
        });
    });

    winston.info("eventbus initialized");

    return emitter;
};