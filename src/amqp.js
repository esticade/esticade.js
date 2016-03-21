var amqp = require('amqplib');
var config = require("./config")

function getTransport()
{
    var connected = amqp.connect(config.connectionURL).then(null, console.warn);

    function getChannel(){
        return connected.then(function (conn) {
            var channelCreated = conn.createChannel();

            channelCreated.then(function (channel) {
                channel.assertExchange(config.exchange, "topic", {durable: true, autoDelete: false})
            });

            return channelCreated;
        });
    }

    function shutdown(){
        return connected.then(function (connection) {
            return connection.close();
        })
    }

    return {
        getChannel: getChannel,
        shutdown: shutdown
    }
}

module.exports = getTransport;
