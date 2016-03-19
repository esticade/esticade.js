var when = require("when");
var emit = require("./emit");
var on = require("./on");

function emission(event, channelPromise){
    var dependencies = [];

    var emission = {
        event: event,
        on: function(eventName, callback){
            dependencies.push(
                on(channelPromise, event.correlationId + "." + eventName, callback)
            );
            return emission;
        },
        timeOut: function(){},
        execute: function(){
            return when.all(dependencies).then(function(){
                emit(event, channelPromise);
            });
        }
    };

    return emission;
}
module.exports = emission;