"use strict";

var sonos = require('sonos');

var search = sonos.search();

search.on('DeviceAvailable', function (device, model) {
    console.log(device, model)
});


// Optionally stop searching and destroy after some time
setTimeout(function () {
    console.log('Stop searching for Sonos devices')
    search.destroy()
}, 30000);