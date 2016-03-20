var esticade = require("../index.js");


// MULTIPLICATION SERVICE
var service = esticade("Multiplication Service");
service.on("MultiplyNumbers", (ev) => ev.emit("MultipliedNumbers", {
    a: ev.body.a,
    b: ev.body.b,
    result: ev.body.a * ev.body.b
}));


// NUMBER GENERATOR SERVICE
service = esticade("Number Generator Service");
setInterval(() => service.emit("MultiplyNumbers", {a: Math.random() * 10, b: Math.random() * 10}), 1000);


// RESULT DISPLAYER SERVICE
service = esticade("Result Displayer");
service.on("MultipliedNumbers", (ev) => console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result));


// DOING REQUEST
service = esticade("Request Service");
service.emitChain("MultiplyNumbers", {a: 10, b: 20})
    .on("MultipliedNumbers", (ev) => {
        // Note that this message is displayed twice as the result displayer service will also pick this up.
        // This is an intended behaviour of the framework, please keep this in mind when developing software.
        console.log(ev.body.a + " + " + ev.body.b + " = " + ev.body.result)
    })
    .execute();
