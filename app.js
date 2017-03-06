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
let plugins = [];

//Init plugins
//Crude plugin system
winston.info("Loading plugins...");

let pluginEcho = require("./plugins/echo");
pluginEcho.initialize(bus);
plugins.push(pluginEcho);

let pluginPushover = require("./plugins/pushover/pushover");
pluginPushover.initialize(bus, config);
plugins.push(pluginPushover);

let pluginWeb = require("./plugins/web/web");
pluginWeb.initialize(bus, app);
plugins.push(pluginWeb);

let pluginSonos = require("./plugins/sonos/sonos");
pluginSonos.initialize(bus);
plugins.push(pluginSonos);

let pluginHue = require("./plugins/hue/hue");
pluginHue.initialize(bus, config);
plugins.push(pluginHue);

//let pluginDoorbell = require("./plugins/gpio/doorbell");
//pluginDoorbell.initialize(bus);
//plugins.push(pluginDoorbell);

winston.info("Plugin load done!");

// do app specific cleaning before exiting
process.on("exit", function () {
    winston.info("Received process exit event");

    for (let i = 0, len = plugins.length; i < len; i++) {
        plugins[i].destroy();
    }
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