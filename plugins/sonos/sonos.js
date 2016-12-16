"use strict";

let sonos = require('sonos');

let searching = false;
let search = sonos.search();
searching = true;

let kitchenDevice = null;

search.on('DeviceAvailable', function (device, model) {
    device.getZoneAttrs((err, info) => {
        if (info.CurrentZoneName == "Køkken") {
            kitchenDevice = device;
            search.destroy();
            searching = false;

            kitchenDevice.currentTrack((err, data) => {
                console.log(data);
            });
        }
    });
});

// Optionally stop searching and destroy after some time
setTimeout(function () {
    console.log('Stop searching for Sonos devices')

    if (searching) {
        search.destroy();
    }

    kitchenDevice.getCurrentState((err, data) => {
        console.log(data);
    });

    // kitchenDevice.getFavoritesRadioStations({"start":0, "total":100}, (err, data) => {
    //     console.log(data);
    // });

    // kitchenDevice.queueNext("x-sonosapi-stream:s59265?sid=254&flags=32&sn=0", (err, queued) => {
    // console.log(queued);


    // });

    kitchenDevice.play("", (err, data) => {
        console.log(data);
    });

    //skala
    //x-sonosapi-stream:s59265?sid=254&flags=32&sn=0

    // kitchenDevice.pause((err, data) => {
    //     console.log(data);
    // });
}, 5000);