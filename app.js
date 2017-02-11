"use strict";

let winston = require("winston");
let http = require("http");
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

winston.add(winston.transports.CircularBuffer, {
    name: 'circular-buffer',
    level: 'debug',
    json: true,
    size: 100
});

winston.info(`http server listening on port: ${config.port}`);

//init eventbus
let bus = eventbus.initialize(server);

//init plugins
winston.info("Initializing plugins...");

require("./plugins/web/web").initialize(app, bus);
//require("./plugins/sonos/sonos").initialize(bus);
//require("./plugins/hue/hue").initialize(bus, config);
require("./plugins/pushover/pushover").initialize(bus, config);

winston.info("Plugin initialization done!");

// var options = {
//     json: true,
//     order: 'asc'
// };

// winston.query(options, function (err, results) {
//     // Check err, handle results array
//     console.log(results);
// });

//https://www.npmjs.com/package/rpi-gpio