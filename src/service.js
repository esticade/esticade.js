var emit = require("./emit");
var emission = require("./emission");
var on = require("./on");
var AMQP = require("./amqp");
var event = require('./event');

module.exports = function(serviceName){
    var transport = AMQP();

    if(!serviceName){
        throw new Error("Service name must be given as an argument");
    }

    var emitChannel = transport.getChannel();

    return {
        on: function(eventName, callback){
            var channel = transport.getChannel();
            return on(channel, "*." + eventName, callback, serviceName + "-" + eventName)
        },
        alwaysOn: function(eventName, callback){
            var channel = transport.getChannel();
            return on(channel, "*." + eventName, callback)
        },
        emit: function(eventName, payload){
            return emit(event(eventName, payload), emitChannel);
        },
        emitChain: function(eventName, payload){
            var channelPromise = transport.getChannel();
            return emission(event(eventName, payload), channelPromise);
        },
        shutdown: function(){
            transport.shutdown();
        }
    };
}