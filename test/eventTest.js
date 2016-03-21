var expect = require("chai").expect;
var esticade = require("../index");
var service;

describe("Event Test", () => {
    after(function (done) {
        service.shutdown().then(done);
    });

    it("should return service object", () => {
        service = esticade("UnitTestService: emitTest");
        expect(service).to.be.a("object").and.have.property("emitChain");
    });

    describe("event", ()=>{
        it("should contain all required properties", (done) =>{
            service.emitChain("EventTest", {})
                .on("EventTest", (ev) => {
                    var expectedProperties = [
                        { name: "emit", type: "function"},
                        { name: "name", type: "string"},
                        { name: "body", type: "object"},
                        { name: "correlationId", type: "string"},
                        { name: "correlationBlock", type: "string"},
                        { name: "eventId", type: "string"},
                    ];

                    expectedProperties.forEach((prop) =>{
                        expect(ev).to.have.property(prop.name).which.is.a(prop.type);
                    });

                    done();
                })
                .execute();
        });

        describe("emit", () => {
            it("trigger new event, which upon arrival should have valid parent ID and matching correlation IDs", (done) => {
                var eventId, correlationId, correlationBlock;
                service.emitChain("EventTest2", {})
                    .on("EventTest2", (ev) => {
                        eventId = ev.eventId;
                        correlationId = ev.correlationId;
                        correlationBlock = ev.correlationBlock;
                        ev.emit("EventTest2-Response");
                    })
                    .on("EventTest2-Response", (ev) => {
                        expect(ev).to.have.property("parentId").which.equals(eventId);
                        expect(ev).to.have.property("correlationId").which.equals(correlationId);
                        expect(ev).to.have.property("correlationBlock").which.equals(correlationBlock);
                        done();
                    })
                    .execute();
            })
        });
    })
});