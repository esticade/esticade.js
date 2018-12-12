'use strict';

var amqp = require('amqplib');
var config = require("./config")

function getTransport()
{
    var timeoutAmount = 1;
    const maxTimeout = 512;

    function errorOut(msg) {
        setTimeout(() => { throw new Error(msg) });
    }

    function getConnection(){
        return amqp.connect(config.connectionURL)
            .catch(function () {
                return new Promise((resolve => {
                    if(timeoutAmount >= maxTimeout) {
                        errorOut("ESTICADE: Failed connecting and max retry timeout achieved.")
                    }

                    if (config.logging) {
                        console.error("ESTICADE: Failed connecting, retrying in", timeoutAmount);
                    }

                    setTimeout(() => {
                        resolve(getConnection());
                        timeoutAmount += timeoutAmount;
                    }, timeoutAmount * 1000);
                }))
            });
    }

    var connected = getConnection();

    function getChannel(){
        return connected.then(function (conn) {
            var channelCreated = conn.createChannel();

            channelCreated.then(function (channel) {
                channel.assertExchange(config.exchange, "topic", {durable: true, autoDelete: false})
                channel.prefetch(config.prefetch)
            });

            return channelCreated;
        });
    }

    function shutdown(){
        return connected.then(function (connection) {
            return connection.close().catch();
        })
    }

    return {
        getChannel: getChannel,
        shutdown: shutdown
    }
}

module.exports = getTransport;
