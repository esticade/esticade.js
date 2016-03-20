var service = require("../index.js")("Request Service");
service.emitChain("MultiplyNumbers", {a: 10, b: 20})
    .on("MultipliedNumbers", (ev) => {
        console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result);
        service.shutdown();
    })
    .timeOut(1000)
    .execute();

