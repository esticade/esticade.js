[![Build Status](https://travis-ci.org/esticade/esticade.js.svg?branch=master)](https://travis-ci.org/esticade/esticade.js)

# Esticade
 
A simple library for creating interconnecting services using RabbitMQ on the background. Will make the pubsub pattern
seamlessly available between different processes. Minimalist API is designed to be easy to learn and flexible enough
for most tasks.

# Install

```npm install esticade --save```

# API

- `esticade(serviceName)` - Will create a new service, connect to the exchange and return a `Service` object.

## Service object

- `on(eventName, callback)` - Will register event listener. Callback will be called with an `Event` object as the only argument. 
If there are two or more instances of the same service running, the events will be equally divided between all the instances. 
If this is not a desired behaviour use `alwaysOn`. Will return promise that is fulfilled once the handler is registered.
If Promise is returned inside on handler, the message is acknowledged when promise is resolved. If promise is Rejected or exception
is thrown inside the on handler the message is nack'ed with small delay which usually means the message is requeued.
- `alwaysOn(eventName, callback)` - Same as `on`, except different instances of the same services will all return the event.   
- `emit(eventName, payload)` - Will emit event to the event network. Returns promise that is fulfilled once the event is emitted.
- `emitChain(eventName, payload)` - Will create an emit chain, allowing events caused by this event to be listened to. Will return `EventChain` object. Note that the event is not triggered before `execute` is called on the event chain.
- `shutdown()` - Will shut the entire service down, if there is nothing else keeping process alive, the process will terminate.

## Event object

- `name` - Name of the event.
- `body` - The content of the message.
- `correlationId` - Will be same on all the events in the event chain.
- `eventId` - Unique identifier for the event
- `parentId` - Id of the event causing this event in the current chain.
- `emit(eventName, payload)` - Will emit event to the event network. Returns promise which is fulfilled once the event is emitted.

## EmitChain object

- `on(eventName, callback)` - Will register event listener in the chain. Will return current `EventChain` object. Callback will be called with an `Event` object as the only argument.
- `execute()` - Trigger the event chain. Returns promise which will be fulfilled once the initiating event is triggered.
- `timeout(timeoutInMsec)` - Set the timeout when the event chain is terminated. Will return current `EventChain` object.
- `timeout(callback)` - Set the callback which is called once the event chain is terminated. Will return current `EventChain` object.
- `timeout(timeoutInMsec, callback)` - Do both of the above. Will return current `EventChain` object.

# Quick start

Install RabbitMQ on the machine and create following scripts:

Service 1 (Multiplication Service):
```javascript
var service = require("esticade")("Multiplication Service");

service.on("MultiplyNumbers", (ev) => ev.emit("MultipliedNumbers", {
    a: ev.body.a,
    b: ev.body.b,
    result: ev.body.a * ev.body.b
}));
```

Service 2 (Number generator):
```javascript
var service = require("esticade")("Number Generator Service");

setInterval(() => service.emit("MultiplyNumbers", {a: Math.random() * 10, b: Math.random() * 10}), 1000);
```

Service 3 (Result displayer):
```javascript
var service = require("esticade")("Result Displayer");

service.on("MultipliedNumbers", (ev) => console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result));
```

One time script (Request based method):
```javascript
var service = require("esticade")("Request Service");

service.emitChain("MultiplyNumbers", {a: 10, b: 20})
    .on("MultipliedNumbers", (ev) => {
        console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result)
        service.shutdown();
    })
    .execute();
```

# Configuration

By default the library will try to connect to localhost with user and pass guest/guest. This is the default configuration
for RabbitMQ. If you want to override that, you can override it with a configuration file in any of following locations.

- Environment variables for each of the configuration variables
- A file pointed to by ESTICADERC environment variable
- esticade.json in current working folder or any parent folder.
- .esticaderc in current user home directory
- /etc/esticade/esticaderc

If any of those files is located in that order, it's contents are read and used for configuration. It should contain
JSON object with any of the following properties: 

- `connectionURL` - Default: `amqp://guest:guest@localhost/`
- `exchange` - Default `events`
- `engraved` - Default `false`. Will make named queues (those registered with service.on()) durable. We suggest you leave this
option to `false` during development as otherwise you will get a lot of permanent queues in the rabbitmq server. You should
turn this on in production though, as it will make sure no messages get lost when service restarts. Turning it off when it
has been turned on might cause errors as the durable queues are not redefined as non-durable automatically. You have
to manually delete the queues from RabbitMQ.

Example:

```
{ 
    "connectionURL": "amqp://user:pass@example.com/vhost",
    "exchange": "EventNetwork"
}
```

## Environment variables

- `ESTICADE_CONNECTION_URL` - AMQP url to connect to
- `ESTICADE_EXCHANGE` - Exchange name
- `ESTICADE_ENGRAVED` - Whether or not to engrave the queues 