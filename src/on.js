var eventObject = require("./eventObject");
var config = require("./config");

function on(haveChan, routingKey, callback, queueName){
    return haveChan.then(function (channel) {
        return channel.assertQueue(queueName, {durable: false, autoDelete: true}).then(function (queue) {
            channel.bindQueue(queue.queue, config.exchange, routingKey);
            return channel.consume(queue.queue, (msg) => callback(
                eventObject(haveChan, JSON.parse(msg.content.toString()))
            ));
        });
    });
}

module.exports = on;
