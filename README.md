# Esticade
 
A simple library for creating interconnecting services using rabbitmq on the background.

# Install

```npm install esticade --save```

# API

`esticade(serviceName)` - Will create a new service, connect to the exchange and return a `Service` object.

## Service object

`on(eventName, callback)` - Will register event listener. Callback will be called with an `Event` object as the only argument. Will return promise that is fulfilled once the handler is registered.
`emit(eventName, payload)` - Will emit event to the event network. Returns promise that is fulfilled once the event is emitted.
`emitChain(eventName, payload)` - Will create an emit chain, allowing events caused by this event to be listened to. Will return `EventChain` object. Note that the event is not triggered before `execute` is called on the event chain.

## Event object

`name` - Name of the event.
`body` - The content of the message.
`correlationId` - Will be same on all the events in the event chain.
`eventId` - Unique identifier for the event
`parentId` - Id of the event causing this event in the current chain.

`emit(eventName, payload)` - Will emit event to the event network. Returns promise which is fulfilled once the event is emitted.

## EmitChain object

`on(eventName, callback)` - Will register event listener in the chain. Will return current `EventChain` object. Callback will be called with an `Event` object as the only argument.
`execute()` - Trigger the event chain. Returns promise which will be fulfilled once the initiating event is triggered.
`timeout(timeoutInMsec)` - Set the timeout when the event chain is terminated. Will return current `EventChain` object.
`timeout(callback)` - Set the callback which is called once the event chain is terminated. Will return current `EventChain` object.
`timeout(timeoutInMsec, callback)` - Do both of the above. Will return current `EventChain` object.

# Quick start

Install RabbitMQ on the machine and create following scripts:

Service 1 (Adding Service):
```
var service = require("esticade")("Adding Service");

service.on("AddNumber", (ev) => ev.emit("AddedNumbers", {
    firstNumber: ev.body.firstNumber,
    secondNumber: ev.body.secondNumber
    result: ev.body.firstNumber + ev.body.secondNumber
});
```

Service 2 (Number generator):
```
var service = require("esticade")("Number Generator Service");

setInterval(() => service.emit("AddNumber", {firstNumber: Math.random(), secondNumber: Math.random()});
```

Service 3 (Result displayer):
```
var service = require("esticade")("Result Displayer");

service.on("AddedNumbers", (ev) => {
    console.log("Got result and it is: " + ev.body.result))
})
```

One time script (Request based method):
```
var service = require("esticade")("Request Service");

service.emitChain("AddNumbers", {firstNumber: 10, secondNumber: 20})
    .on("AddedNumbers", (ev) => {
        console.log(ev.body.firstNumber + " + " + ev.body.secondNumber + " = " + ev.body.result))
        service.shutdown();
    }
    .execute();
```

# Configuration

By default the library will try to connect to localhost with user and pass guest/guest. This is the default configuration
for RabbitMQ. If you want to override that, you can override it with a configuration file in any of following locations.

- A file pointed to by ESTICADERC environment variable
- esticade.json in current working folder or any parent folder.
- /etc/esticade/esticaderc
- .esticaderc in current user home directory

If any of those files is located in that order, it's contents are read and used for configuration. It should contain
JSON object with any of the following properties: 

- `connectionURL` - Default: `amqp://guest:guest@localhost/`
- `exchange` - Default `events`

Example:

```
{ 
    "connectionURL": "amqp://user:pass@example.com/vhost"
    "exchange": "EventNetwork"
}
```