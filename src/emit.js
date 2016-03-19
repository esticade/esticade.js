function emit(event, haveChan) {
    var routingKey = event.correlationId + "." + event.name;
    return haveChan.then(function (channel) {
        return channel.publish(
            "events",
            routingKey,
            new Buffer(JSON.stringify(event)),
            {contentType: "application/json"}
        )
    })
}

module.exports = emit;