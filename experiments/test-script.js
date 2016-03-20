var esticade = require("./../index");
var service = esticade("Test Service");

service.on("TestEvent", ev => console.log("Callback triggered", ev.name))
    .then(() => service.emit("TestEvent", 123));

service.emitChain("GetNumberOfCats")
    .on("GetNumberOfCats", (ev) => {
        console.log(ev.name + " called")

        ev.emit("NumberOfCats", 13);
        setTimeout(() => {
            ev.emit("NumberOfCats", "[Should not be seen because of timeout]")
        }, 2000);
    })
    .on("NumberOfCats", (ev) => {
        console.log("We have " + ev.body + " cats");
        setTimeout(() => service.shutdown(), 3000);
    })
    .timeOut(1000, () => console.log("Chain timed out"))
    .execute();
