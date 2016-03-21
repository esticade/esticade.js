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

    var channel = transport.getChannel();

    return {
        on: function(eventName, callback){

            if(!eventName){
                throw new Error("Event name must be specified");
            }

            if(!callback){
                throw new Error("Callback must be provided");
            }

            if(typeof callback != "function"){
                throw new Error("Callback must be a function");
            }


            return on(channel, "*." + eventName, callback, serviceName + "-" + eventName)
        },
        alwaysOn: function(eventName, callback){
            return on(channel, "*." + eventName, callback)
        },
        emit: function(eventName, payload){
            return emit(event(eventName, payload), channel);
        },
        emitChain: function(eventName, payload){
            return emission(event(eventName, payload), channel);
        },
        shutdown: function(){
            transport.shutdown();
        }
    };
}