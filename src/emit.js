'use strict';

var config = require("./config");

function emit(event, haveChan) {
    var routingKey = event.correlationBlock + "." + event.name;
    return haveChan.then(function (channel) {
        return channel.publish(
            config.exchange,
            routingKey,
            new Buffer(JSON.stringify(event)),
            {contentType: "application/json", persistent: true}
        )
    })
}

module.exports = emit;