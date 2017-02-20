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

// process.on("SIGINT", () => {
//     winston.info("Got SIGINT event! Closing down");
// });

let plugins = [];

function getPluginInfos() {
    let infos = [];
    for(idx in plugins) {
        let info = plugins[idx].info();
        infos.push(info);
    }
    return infos;
}

//Init plugins
winston.info("Loading plugins...");

//pushover
plugins.push(require("./plugins/echo").initialize(bus));
plugins.push(require("./plugins/web/web").initialize(app, getPluginInfos));
//plugins.push(require("./plugins/sonos/sonos").initialize(bus));
//plugins.push(require("./plugins/hue/hue").initialize(bus, config));
//plugins.push(require("./plugins/gpio/doorbell").initialize(bus));

winston.debug(plugins);

winston.info("Plugin load done!");

function loadPlugin(pluginPath) {
    let plugin = require(pluginPath)
    plugin.initialize(bus, config, app);
    plugins.push(plugin);
}
