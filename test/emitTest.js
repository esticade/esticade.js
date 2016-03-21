var expect = require("chai").expect;
var esticade = require("../index");
var service;

describe("Emit Test", function(){
    after(function(done){ service.shutdown().then(done); });

    it("should return service object", function () {
        service = esticade("UnitTestService: emitTest");
        expect(service).to.be.a("object").and.have.property("emitChain");
    });

    describe("emit", function(){
        it("should throw an error when no arguments are given", function () {
            expect(()=>service.emit()).to.throw("Event name must be specified");
        });

        it("should return promise that is resolved once the event is emitted", function (done) {
            var promise = service.emit("TestEvent");
            expect(promise).to.be.an("object").and.have.property("then");
            promise.then(function () {
                done()
            })
        });
    })
});