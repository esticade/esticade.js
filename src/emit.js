'use strict';

var config = require("./config");

function emit(event, channel) {
    const routingKey = event.correlationBlock + "." + event.name;
    return channel.publish(
        config.exchange,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {contentType: "application/json", persistent: true}
    )
}

module.exports = emit;