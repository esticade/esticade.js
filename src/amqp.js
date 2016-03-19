var amqp = require('amqplib');
var config = require("./config")

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
    connected.then(function (connection) {
        connection.close();
    })
}

module.exports = {
    getChannel: getChannel,
    shutdown: shutdown
};
