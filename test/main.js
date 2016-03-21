var expect = require("chai").expect;
var esticade = require("../index");
var service;

describe("Main Scaffolding test", function () {
    after(function(done){ service.shutdown().then(done); });

    it("should be a function", function () {
        expect(esticade).to.be.a("function");
    });

    it("should throw an Error when no service name is given", function(){
        expect(() => esticade()).to.throw("Service name must be given as an argument");
    });

    it("should return service object when calling", function () {
        service = esticade("UnitTestService: main");
        expect(service).to.be.an("object");
    });

    describe("service", function () {
        it("should have an 'on' method", function () {
            expect(service).to.have.property("on")
                .that.is.a("function");
        });

        it("should have an 'emit' method", function () {
            expect(service).to.have.property("emit")
                .that.is.a("function");
        });

        it("should have an 'emitChain' method", function () {
            expect(service).to.have.property("emitChain")
                .that.is.a("function");
        });

        it("should have an 'shutdown' method", function () {
            expect(service).to.have.property("shutdown")
                .that.is.a("function");
        });
    });

});