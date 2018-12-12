'use strict';

var eventObject = require("./eventObject");
var config = require("./config");

function on(serviceName, haveChan, routingKey, callback, queueName){
    return haveChan.then(function (channel) {
        return channel.assertQueue(queueName, getQueueOptions(queueName)).then(function (queue) {
            channel.bindQueue(queue.queue, config.exchange, routingKey);
            return channel.consume(queue.queue, (msg) =>
                new Promise((resolve) => resolve(callback(eventObject(serviceName, haveChan, JSON.parse(msg.content.toString())))))
                    .then(() => channel.ack(msg))
                    .catch((error) => {
                        if (config.logging) {
                            console.error("ESTICADE: message rejected by on handler: " + queueName)
                        }
                        setTimeout(() => channel.nack(msg), 1000)
                    })
            );
        });
    });
}

function getQueueOptions(queueName) {
    var durable = false;
    var autoDelete = true;

    // If config "engraved" is on, named queues become durable
    if (queueName) {
        durable = config.engraved;
        autoDelete = !config.engraved;
    }

    var options = {durable: durable, autoDelete: autoDelete};
    return options;
}

module.exports = on;
