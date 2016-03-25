var _ = require("underscore");
var emit = require("./emit");
var createEvent = require("./event");

function eventObject(serviceName, haveChan, event){
    return _.extend({
        emit: function(eventName, payload){
            return emit(createEvent(serviceName, eventName, payload, event), haveChan);
        }
    }, event);
}

module.exports = eventObject;