const expect = require('chai').expect;
const esticade = require('../index');
let service;

describe('On test', function () {
  after(function (done) {
    service.shutdown().then(done);
  });

  it('should return service object', function () {
    service = esticade('UnitTestService: on');
    expect(service).to.be.a('object').and.have.property('emitChain');
  });

  describe('on', function () {
    it('should throw an error when no arguments are given', function () {
      expect(() => service.on()).to.throw('Event name must be specified');
    });

    it('should throw an error when no callback is given', function () {
      expect(() => service.on('TestEvent')).to.throw('Callback must be provided');
    });

    it('should throw an error when no callback is not a function', function () {
      expect(() => service.on('TestEvent', 123)).to.throw('Callback must be a function');
    });

    it('should return promise that is resolved once the event listener is started', function (done) {
      const promise = service.on('TestEvent', () => {
      });
      expect(promise).to.be.a('Promise')
      promise.then(function () {
        done()
      })
    });

    it('should receive events sent from emit', function (done) {
      const emittedEvent = {a: 123, b: 34.56, c: {f: 'string', g: [1, 2, 3, 4]}};
      service.on('EmitTest', function (ev) {
        expect(ev.body).to.deep.equal(emittedEvent);
        done()
      }).then(function () {
        service.emit('EmitTest', emittedEvent);
      })
    })

    it('should not acknowledge event if the handler returns rejected promise', function (done) {
      const emittedEvent = {a: 123, b: 34.56, c: {f: 'string', g: [1, 2, 3, 4]}};
      let tries = 0;
      service.on('EmitTestRejection', function (ev) {
        if (tries === 0) {
          tries++
          return Promise.reject('Bad stuff')
        } else {
          done()
        }
      }).then(function () {
        service.emit('EmitTestRejection', emittedEvent);
      })
    })

    it('should not acknowledge event if the handler throws an exception', function (done) {
      const emittedEvent = {a: 123, b: 34.56, c: {f: 'string', g: [1, 2, 3, 4]}};
      let tries = 0;
      service.on('EmitTestException', function (ev) {
        if (tries === 0) {
          tries++
          throw new Error('Something went wrong')
        } else {
          done()
        }
      }).then(function () {
        service.emit('EmitTestException', emittedEvent);
      })
    })
  });

  describe('alwaysOn', function () {
    it('should throw an error when no arguments are given', function () {
      expect(() => service.alwaysOn()).to.throw('Event name must be specified');
    });

    it('should throw an error when no callback is given', function () {
      expect(() => service.alwaysOn('TestEvent')).to.throw('Callback must be provided');
    });

    it('should throw an error when no callback is not a function', function () {
      expect(() => service.alwaysOn('TestEvent', 123)).to.throw('Callback must be a function');
    });

    it('should return promise that is resolved once the event listener is started', function (done) {
      const promise = service.alwaysOn('TestEvent', () => {
      });
      expect(promise).to.be.a('Promise')
      promise.then(function () {
        done()
      })
    });

    it('should receive events sent from emit', function (done) {
      const emittedEvent = {a: 123, b: 34.56, c: {f: 'string', g: [1, 2, 3, 4]}};
      service.alwaysOn('EmitTest2', function (ev) {
        expect(ev.body).to.deep.equal(emittedEvent);
        done()
      }).then(function () {
        service.emit('EmitTest2', emittedEvent);
      })
    })
  });
});