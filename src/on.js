'use strict';

var eventObject = require("./eventObject");
var config = require("./config");

function on(serviceName, haveChan, routingKey, callback, queueName){
    return haveChan.then(function (channel) {
        return channel.assertQueue(queueName, getQueueOptions(queueName)).then(function (queue) {
            channel.bindQueue(queue.queue, config.exchange, routingKey);
            return channel.consume(queue.queue, (msg) => {
                callback(eventObject(serviceName, haveChan, JSON.parse(msg.content.toString())));
                channel.ack(msg);
            });
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
