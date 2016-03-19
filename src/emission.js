var when = require("when");
var emit = require("./emit");
var on = require("./on");

function emission(event, channelPromise){
    var dependencies = [];
    var timeout = 60000;
    var timeoutHandler;

    var emission = {
        event: event,
        on: function(eventName, callback){
            dependencies.push(
                on(channelPromise, event.correlationId + "." + eventName, callback)
            );
            return emission;
        },
        timeOut: function(a, b){
            if(typeof a == "function") timeoutHandler = a;
            if(typeof a == "number") timeout = a;
            if(typeof b == "function") timeoutHandler = b;
            if(typeof b == "number") timeout = b;

            return emission;
        },
        execute: function(){
            var emitted = when.all(dependencies).then(function(){
                return emit(event, channelPromise);
            });

            emitted.then(function () {
                setTimeout(function () {
                    channelPromise.then((channel) => channel.close()).catch(() => {});
                    if(timeoutHandler) timeoutHandler();
                }, timeout)
            });

            return emitted;
        }
    };

    return emission;
}
module.exports = emission;