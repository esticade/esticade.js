var uuid = require('node-uuid');

var currentServiceCorrBlock = uuid.v4();

function createEvent(eventName, payload, parentEvent) {
    var correlationId, correlationBlock, parentId;
    if (parentEvent) {
        correlationId = parentEvent.correlationId;
        correlationBlock = parentEvent.correlationBlock;
        parentId = parentEvent.eventId;
    } else {
        correlationId = uuid.v4();
        correlationBlock = currentServiceCorrBlock;
    }

    var event = {
        correlationId: correlationId,
        correlationBlock: correlationBlock,
        eventId: uuid.v4(),
        parentId: parentId,
        name: eventName,
        body: payload
    };

    return event;
}

module.exports = createEvent;