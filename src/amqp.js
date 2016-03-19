var amqp = require('amqplib');

var connected = amqp.connect("amqp://esticade:esticade@impact.ccat.eu:5672/esticade").then(null, console.warn);

function getChannel(){
    return connected.then(function (conn) {
        var channelCreated = conn.createChannel();

        channelCreated.then(function (channel) {
            channel.assertExchange("events", "topic", {durable: true, autoDelete: false})
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
