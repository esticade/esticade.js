var expect = require("chai").expect;
var esticade = require("../index");
var service;

xdescribe("Event Test", function() {
    after(function (done) {
        service.shutdown().then(done);
    });

    it("should return service object", function () {
        service = esticade("UnitTestService: emitTest");
        expect(service).to.be.a("object").and.have.property("emitChain");
    });

})