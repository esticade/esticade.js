'use strict';

const emit = require('./emit');
const createEvent = require('./event');

function eventObject(serviceName, haveChan, event) {
  return Object.assign({
    emit: function (eventName, payload) {
      return emit(createEvent(serviceName, eventName, payload, event), haveChan);
    }
  }, event);
}

module.exports = eventObject;