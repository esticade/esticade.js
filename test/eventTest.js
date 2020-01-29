const expect = require('chai').expect;
const esticade = require('../index');
let service;

describe('Event Test', () => {
  after(function (done) {
    service.shutdown().then(done);
  });

  it('should return service object', () => {
    service = esticade('UnitTestService: emitTest');
    expect(service).to.be.a('object').and.have.property('emitChain');
  });

  describe('event', () => {
    it('should contain all required properties', (done) => {
      service.emitChain('EventTest', {a: 1})
        .on('EventTest', (ev) => {
          var expectedProperties = [
            {name: 'emit', type: 'function'},
            {name: 'name', type: 'string', value: 'EventTest'},
            {name: 'body', type: 'object', value: {a: 1}},
            {name: 'correlationId', type: 'string'},
            {name: 'correlationBlock', type: 'string'},
            {name: 'eventId', type: 'string'},
            {name: 'service', type: 'string', value: 'UnitTestService: emitTest'}
          ];

          expectedProperties.forEach((prop) => {
            expect(ev).to.have.property(prop.name).which.is.a(prop.type);
            if (prop.value) {
              expect(ev[prop.name]).to.deep.equal(prop.value)
            }
          });

          done();
        })
        .execute();
    });

    describe('emit', () => {
      it('trigger new event, which upon arrival should have valid parent ID and matching correlation IDs', (done) => {
        let eventId, correlationId, correlationBlock;
        service.emitChain('EventTest2', {})
          .on('EventTest2', (ev) => {
            eventId = ev.eventId;
            correlationId = ev.correlationId;
            correlationBlock = ev.correlationBlock;
            ev.emit('EventTest2-Response');
          })
          .on('EventTest2-Response', (ev) => {
            expect(ev).to.have.property('parentId').which.equals(eventId);
            expect(ev).to.have.property('correlationId').which.equals(correlationId);
            expect(ev).to.have.property('correlationBlock').which.equals(correlationBlock);
            done();
          })
          .execute();
      })
    });
  })
});