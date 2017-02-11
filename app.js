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
        path: "/logs"
    }
});

//Circular buffer transport
winston.add(winston.transports.CircularBuffer, {
    name: "circular-buffer",
    level: config.logLevel,
    json: true,
    size: config.loggingBufferSize
});

winston.info(`http server listening on port: ${config.port}`);

//Init eventbus
let bus = eventbus.initialize(server);

//Init plugins
winston.info("Initializing plugins...");

require("./plugins/web/web").initialize(app, bus);
//require("./plugins/sonos/sonos").initialize(bus);
//require("./plugins/hue/hue").initialize(bus, config);
require("./plugins/pushover/pushover").initialize(bus, config);

winston.info("Plugin initialization done!");