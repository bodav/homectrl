"use strict";

let winston = require("winston");
let EventEmitter2 = require('eventemitter2').EventEmitter2;
let ws = require("ws");

module.exports.initialize = (httpServer) => {
    winston.info("Initializing eventbus...");

    //Internal event router
    let emitter = new EventEmitter2();

    //External event socket
    let wsServer = new ws.Server({
        server: httpServer,
        path: "/events"
    });

    //Broadcast events til clients
    emitter.onAny((event, value) => {
        wsServer.clients.forEach((client) => {
            client.send(JSON.stringify({
                "event": event,
                "payload": value
            }));
        });
    });

    //Receive events from clients
    wsServer.on("connection", (socket) => {
        winston.debug("Event client connected");

        socket.on("message", (msg) => {
            let evnt = JSON.parse(msg);
            emitter.emit(evnt.event, evnt.payload);
        });
    });

    winston.info("eventbus initialized");

    return emitter;
};