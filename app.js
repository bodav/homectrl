"use strict";

let winston = require("winston");
let wswinston = require("winston-websocket");
let winstoncbuff = require('winston-circular-buffer');
let config = require("./config.json");
let eventbus = require("./eventbus");
let express = require("express");

//create express app
let app = express();

//start server
let server = app.listen(config.port);

//winston logging setup
//Console transport
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: config.logLevel,
    colorize: true,
    timestamp: true
});

//Websocket transport
winston.add(wswinston.WSTransport, {
    wsoptions: {
        server: server,
        path: "/winston"
    }
});

//Circular buffer transport
winston.add(winston.transports.CircularBuffer, {
    name: "buffer",
    level: config.logLevel,
    json: true,
    size: config.loggingBufferSize
});

winston.info(`http server listening on port: ${config.port}`);

//Init eventbus
let bus = eventbus.initialize(server);

//Init plugins
//Crude plugin system
winston.info("Loading plugins...");

require("./plugins/echo").initialize(bus);
require("./plugins/pushover/pushover").initialize(bus, config);
require("./plugins/sonos/sonos").initialize(bus);
require("./plugins/hue/hue").initialize(bus, config);
require("./plugins/web/web").initialize(bus, app);
//require("./plugins/gpio/doorbell").initialize(bus);

winston.info("Plugin load done!");

// do app specific cleaning before exiting
process.on("exit", function () {
    winston.info("Received process exit event");
});

// catch ctrl+c event and exit normally
process.on("SIGINT", function () {
    winston.info("SIGINT received");
    process.exit(2);
});

//catch uncaught exceptions, trace, then exit normally
process.on("uncaughtException", function(e) {
    winston.error("Uncaught Exception");
    winston.error(e);
    process.exit(99);
});