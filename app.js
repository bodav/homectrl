"use strict";

let winston = require("winston");
let http = require("http");
let wswinston = require("winston-websocket");
let config = require("./config.json");
let eventbus = require("./eventbus");
let express = require("express");

//create express app
let app = express();

//start server
let server = app.listen(config.port);

//winston logging setup
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

//init eventbus
let bus = eventbus.initialize(server);

//init plugins
winston.info("Initializing plugins...");

require("./plugins/eventgen").initialize(bus);
require("./plugins/web/web").initialize(app, bus);
//require("./plugins/sonos/sonos").initialize(bus);

winston.info("Plugin initialization done!");