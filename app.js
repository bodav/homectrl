"use strict";

let winston = require("winston");
let http = require("http");
let wswinston = require("winston-websocket");
let config = require("./config.json");
let eventbus = require("./eventbus");

//create http server
let server = http.createServer();

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

//start server
server.listen(config.port, () => {
    winston.info(`Server is listening on port ${server.address().port}`);
});

//init eventbus
let bus = eventbus.initialize(server);

//init plugins
require("./plugins/eventgen").initialize(server, bus);