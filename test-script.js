var esticade = require("./index");
var service = esticade("Test Service");

service.on("TestEvent", ev => console.log("Callback triggered", ev.name))
    .then(() => service.emit("TestEvent", 123));

service.emitChain("GetNumberOfCats")
    .on("GetNumberOfCats", (ev) => { ev.emit("NumberOfCats", 13); console.log(ev.name + " called") })
    .on("NumberOfCats", (ev) => {
        console.log("We have " + ev.body + " cats");
        service.shutdown();
    })
    .execute();
