var eventObject = require("./eventObject");

function on(haveChan, routingKey, callback){
    return haveChan.then(function (channel) {
        return channel.assertQueue(null, {durable: false, autoDelete: true}).then(function (queue) {
            channel.bindQueue(queue.queue, "events", routingKey);
            return channel.consume(queue.queue, (msg) => callback(
                eventObject(haveChan, JSON.parse(msg.content.toString()))
            ));
        });
    });
}

module.exports = on;
