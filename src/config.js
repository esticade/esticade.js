'use strict';

var homedir = require("homedir");
var path = require("path");
var fs = require("fs");

module.exports = getConfig();

function getFromEnv(env, defaultValue) {
    return process.env[env] || defaultValue;
}


function getBooleanFromEnv(env, defaultValue) {
    var value = process.env[env];

    if(!value) {
        return defaultValue;
    }

    value = value.toLowerCase();
    return !!(value == "yes" || value == "on" || value == "true")
}

function applyEnvironmentOverrides(config) {
    return {
        connectionURL: getFromEnv("ESTICADE_CONNECTION_URL", config.connectionURL),
        exchange: getFromEnv("ESTICADE_EXCHANGE", config.exchange),
        engraved: getBooleanFromEnv("ESTICADE_ENGRAVED", config.engraved),
        prefetch: parseInt(getFromEnv("ESTICADE_PREFETCH", config.prefetch)),
        logging: getBooleanFromEnv("ESTICADE_LOGGING_ENABLED", config.logging)
    }
}

function getConfig() {
    var config = {
        connectionURL: "amqp://guest:guest@localhost/",
        exchange: "events",
        engraved: false,
        prefetch: 100,
        logging: false
    };

    var configFile = getConfigFile();

    if (configFile) {
        Object.assign(config, JSON.parse(fs.readFileSync(configFile)));
    }

    config = applyEnvironmentOverrides(config);

    return config;
}

function findCWDConfigFile(){
    var dir = process.cwd();
    do{
        var file = dir + path.sep + "esticade.json";
        try {
            fs.accessSync(file, fs.R_OK)
            return file;
        } catch(e){}
        var oldDir = dir;
        dir = path.resolve(dir, "..");
    } while(oldDir != dir);
    return undefined;
}

function getConfigFile(){
    var configPaths = [
        process.env.ESTICADERC,
        findCWDConfigFile(),
        homedir() + path.sep + ".esticaderc",
        "/etc/esticade/esticaderc"
    ];

    return configPaths.filter(function (file) {
        try {
            fs.accessSync(file, fs.R_OK)
            return true;
        } catch(e){
            return false;
        }
    })[0];
}
