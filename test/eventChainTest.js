const expect = require('chai').expect;
const esticade = require('../index');
const Deferred = require('../src/deferred');
let service;

describe('Event Chain Test', function () {
  after(function (done) {
    service.shutdown().then(done);
  });

  it('should return service object', function () {
    service = esticade('UnitTestService: eventChainTest');
    expect(service).to.be.a('object').and.have.property('emitChain');
  });

  describe('emitChain', function () {
    it('should throw an error when no arguments are given', function () {
      expect(() => service.emitChain()).to.throw('Event name must be specified');
    });

    it('Should return an emission object with required properties', function (done) {
      const emission = service.emitChain('EmitChainTestEvent')
      expect(emission).to.be.an('object');
      expect(emission).to.have.property('on').which.is.a('function');
      expect(emission).to.have.property('execute').which.is.a('function');
      expect(emission).to.have.property('timeOut').which.is.a('function');
      expect(emission).to.have.property('timeout').which.is.a('function');
      emission.execute().then(() => {
        done()
      });
    });

    it('Should be able to emit a regular event', function (done) {
      const testPayload = {a: 'abc', n: Math.random()};
      service.on('RegularEmissionTest', (ev) => {
        expect(ev.body).to.deep.equal(testPayload);
        done();
      }).then(() => {
        service.emitChain('RegularEmissionTest', testPayload).execute();
      });
    });

    it('Should be able to catch it\'s own event', function (done) {
      const testRequest = {a: 'abc', n: Math.random()};

      service.emitChain('SelfEmitTest', testRequest)
        .on('SelfEmitTest', (ev) => {
          expect(ev.body).to.deep.equal(testRequest);
          done();
        })
        .execute();
    });

    it('Should be able to catch response from a separate handler service', function (done) {
      const testRequest = {a: 'abc', n: Math.random()};
      const testResponse = {b: 'def', n: Math.random()};

      service.on('ResponseTest', (ev) => {
        expect(ev.body).to.deep.equal(testRequest);
        ev.emit('ResponseTest-Reply', testResponse);
      }).then(() => {
        service.emitChain('ResponseTest', testRequest)
          .on('ResponseTest-Reply', (ev) => {
            expect(ev.body).to.deep.equal(testResponse);
            done();
          })
          .execute();
      });
    });

    it('Should be able to handle multiple different responses', function (done) {
      const a = new Deferred(),
        b = new Deferred(),
        c = new Deferred();

      service.on('MultiResponseTest', (ev) => {
        ev.emit('MultiResponseTest-Reply1', 1);
        ev.emit('MultiResponseTest-Reply2', 2);
        ev.emit('MultiResponseTest-Reply3', 3);
      }).then(() => {
        service.emitChain('MultiResponseTest')
          .on('MultiResponseTest-Reply1', (ev) => {
            expect(ev.body).to.equal(1);
            a.resolve()
          })
          .on('MultiResponseTest-Reply2', (ev) => {
            expect(ev.body).to.equal(2);
            b.resolve()
          })
          .on('MultiResponseTest-Reply3', (ev) => {
            expect(ev.body).to.equal(3);
            c.resolve()
          })
          .execute();
      });

      Promise.all([a.promise, b.promise, c.promise]).then(() => {
        done();
      })
    });

    describe('timeout', () => {
      it('should stop callback from being called if event arrive later than timeout time', (done) => {
        service.emitChain('TestTimeout')
          .timeout(300)
          .on('TestTimeout', (ev) => {
            setTimeout(() => {
              ev.emit('TestTimeoutTriggeredEvent');
            }, 500);
            setTimeout(() => {
              done();
            }, 600);
          })
          .on('TestTimeoutTriggeredEvent', () => {
            expect('This should never be evaluated').to.be.false;
          })
          .execute();
      })
    })
  })
});