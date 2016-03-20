var service = require("../index.js")("Request Service");
setInterval(() => {
    console.log("Requesting...");
    service.emitChain("Numbers", {a: Math.random() * 100, b: Math.random() * 100})
        .on("MultipliedNumbers", (ev) => {
            console.log(ev.body.a + " * " + ev.body.b + " = " + ev.body.result);
        })
        .on("AddedNumbers", (ev) => {
            console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result);
        })
        .execute();
}, 1000);


