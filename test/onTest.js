var expect = require("chai").expect;
var esticade = require("../index");
var service;

describe("esticade", function(){
    it("should return service object", function () {
        service = esticade("UnitTestService");
        expect(service).to.be.a("object").and.have.property("emitChain");
    });

    describe("on", function(){
        it("should throw an error when no arguments are given", function () {
            expect(()=>service.on()).to.throw("Event name must be specified");
        });

        it("should throw an error when no callback is given", function () {
            expect(()=>service.on("TestEvent")).to.throw("Callback must be provided");
        });

        it("should throw an error when no callback is not a function", function () {
            expect(()=>service.on("TestEvent", 123)).to.throw("Callback must be a function");
        });

        it("should return promise that is resolved once the event listener is started", function (done) {
            var promise = service.on("TestEvent", () => {});
            expect(promise).to.be.an("object").and.have.property("then");
            promise.then(function () {
                done()
            })
        });

        it("should receive events sent from emit", function (done) {
            var emittedEvent = { a: 123, b: 34.56, c: { f: "string", g: [1, 2, 3, 4]}};
            service.on("EmitTest", function (ev) {
                expect(ev.body).to.deep.equal(emittedEvent);
                done()
            }).then(function () {
                service.emit("EmitTest", emittedEvent);
            })
        })
    })
});