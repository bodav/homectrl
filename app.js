"use strict";

let winston = require("winston");
let EventEmitter2 = require('eventemitter2').EventEmitter2;
let http = require("http");
let wswinston = require("winston-websocket");

//plugins

//create http server
let server = http.createServer();

//winston setup
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: "debug",
    colorize: true,
    timestamp: true
});

winston.add(wswinston.WSTransport, {
    wsoptions: {
        server: server,
        path: "/logs"
    }
});

//event router
let emitter = new EventEmitter2();

emitter.onAny((event, value) => {
    //TODO: broadcast event
});

//start server
server.listen(9797);
winston.info("Server is listening on port 9797");

//init plugins

function initPlugin(plugin) {

}