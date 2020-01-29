'use strict';

const amqp = require('amqp-connection-manager');
const config = require('./config')

function getTransport() {
  function getConnection() {
    return amqp.connect(config.connectionURL)
  }

  const connection = getConnection();

  function getChannel() {
    return connection.createChannel({
      setup(channel) {
        channel.assertExchange(config.exchange, 'topic', {durable: true, autoDelete: false})
        channel.prefetch(config.prefetch)
      }
    })
  }

  function shutdown() {
    return connection.close()
  }

  return {
    getChannel: getChannel,
    shutdown: shutdown
  }
}

module.exports = getTransport;
