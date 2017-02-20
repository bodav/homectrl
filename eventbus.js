"use strict";

let winston = require("winston");
let EventEmitter2 = require('eventemitter2').EventEmitter2;
let ws = require("ws");
let util = require("util");

module.exports.initialize = (httpServer) => {
    winston.info("Initializing eventbus...");

    //Internal eventbus
    let emitter = new EventEmitter2();

    //External event websocket
    let wsServer = new ws.Server({
        server: httpServer,
        path: "/eventbus"
    });

    //Broadcast events to external clients
    emitter.onAny((event, value) => {
        wsServer.clients.forEach((client) => {
            client.send(JSON.stringify({
                "event": event,
                "payload": value
            }));
        });
    });

    //Receive events from external clients
    wsServer.on("connection", (socket) => {
        winston.debug("Websocket eventbus client connected");

        socket.on("message", (msg) => {

            let evnt = JSON.parse(msg);
            winston.debug(util.inspect(evnt));
            emitter.emit(evnt.event, evnt.payload);
        });
    });

    winston.info("Eventbus initialized");

    return emitter;
};