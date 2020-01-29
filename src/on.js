'use strict';

const eventObject = require('./eventObject');
const config = require('./config');

function on(serviceName, channelWrapper, routingKey, callback, queueName) {
  return channelWrapper.addSetup((channel) => {
    return Promise.all([
      channel.assertQueue(queueName, getQueueOptions(queueName)),
      channel.bindQueue(queueName, config.exchange, routingKey),
      channel.consume(queueName, async (msg) => {
        try {
          await Promise.resolve(callback(eventObject(serviceName, channelWrapper, JSON.parse(msg.content.toString()))))
          channel.ack(msg)
        } catch (error) {
          if (config.logging) {
            console.error('ESTICADE: message rejected by on handler: ' + queueName)
          }
          setTimeout(() => channel.nack(msg), 1000)
        }
      })
    ])
  })
}

function getQueueOptions(queueName) {
  let durable = false;
  let autoDelete = true;

  // If config "engraved" is on, named queues become durable
  if (queueName) {
    durable = config.engraved;
    autoDelete = !config.engraved;
  }

  return {durable: durable, autoDelete: autoDelete};
}

module.exports = on;
