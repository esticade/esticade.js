var esticade = require("../index");

// Create two "instances" of the same service
var service1 = esticade("Service");
var service2 = esticade("Service");

// Those handlers should get events spread between them
service1.on("Event", (ev) => console.log("\\ Service 1 received event"));
service2.on("Event", (ev) => console.log("/ Service 2 received event"));

// Those handlers will always get events
service1.alwaysOn("Event", (ev) => console.log("# Service 1 received event from always handler"));
service2.alwaysOn("Event", (ev) => console.log("# Service 2 received event from always handler"));

// Trigger an event every 2 seconds
setInterval(() => service1.emit("Event"), 2000);
