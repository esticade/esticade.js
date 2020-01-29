'use strict';

const uuid = require('uuid');

const currentServiceCorrBlock = uuid.v4();

function createEvent(serviceName, eventName, payload, parentEvent) {
  if (!eventName) {
    throw new Error('Event name must be specified');
  }

  let correlationId, correlationBlock, parentId;
  if (parentEvent) {
    correlationId = parentEvent.correlationId;
    correlationBlock = parentEvent.correlationBlock;
    parentId = parentEvent.eventId;
  } else {
    correlationId = uuid.v4();
    correlationBlock = currentServiceCorrBlock;
  }

  return {
      correlationId: correlationId,
      correlationBlock: correlationBlock,
      eventId: uuid.v4(),
      parentId: parentId,
      name: eventName,
      body: payload,
      service: serviceName
  };
}

module.exports = createEvent;