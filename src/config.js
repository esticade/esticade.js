var homedir = require("homedir");
var path = require("path");
var fs = require("fs");
var _ = require("underscore");

module.exports = getConfig();

function getConfig() {
    var config = {
        connectionURL: "amqp://guest:guest@localhost/",
        exchange: "events",
        engraved: false
    };

    var configFile = getConfigFile();

    if (configFile) {
        _.extend(config, JSON.parse(fs.readFileSync(configFile)));
    }
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
