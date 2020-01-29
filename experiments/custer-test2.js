process.env.ESTICADE_CONNECTION_URL='amqp://guest:guest@localhost:5672/,amqp://guest:guest@localhost:5673/,amqp://guest:guest@localhost:5674/'

var esticade = require("./../index");
var service = esticade("Test Service");

service.alwaysOn("cat", (ev) => {
  console.log(ev.body)
})
