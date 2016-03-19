var uuid = require('node-uuid');

function createEvent(eventName, payload, parentEvent) {
    var correlationId, parentId;
    if (parentEvent) {
        correlationId = parentEvent.correlationId;
        parentId = parentEvent.eventId;
    } else {
        correlationId = uuid.v4();
    }

    var event = {
        correlationId: correlationId,
        eventId: uuid.v4(),
        parentId: parentId,
        name: eventName,
        body: payload
    };

    return event;
}

module.exports = createEvent;