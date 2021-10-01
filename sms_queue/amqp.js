const amqp = require('amqplib')
const { AMQP_EVENTS_EX_NAME, AMQP_EVENTS_QUEUE_NAME, AMQP_EVENTS_ROUTING, AMQP_URI } = require('./utils/env.')
const { Subject } = require('rxjs')

console.log('AMQP: connecting to', AMQP_URI)
const Broker = amqp.connect(AMQP_URI)

Broker.then(() => console.log('AMQP: connected'))

Broker.catch(err => {
  console.error('AMQP: Connection Error', err);
  process.exit(1);
})

const getDeviceQueue = (concurrentSubscribers) => {
  const EventsQueue = new Subject();
  Broker.then(connection => {
    connection.createChannel()
      .then(channel => channel.checkExchange(AMQP_EVENTS_EX_NAME)
        .then(() => channel.assertQueue(AMQP_EVENTS_QUEUE_NAME, {
            arguments: { 'x-queue-type': 'classic' }
          })
          .then(q => {
            // bind queue
            channel.prefetch(concurrentSubscribers);
            channel.bindQueue(q.queue, AMQP_EVENTS_EX_NAME, AMQP_EVENTS_ROUTING)
              .then(() => channel.consume(AMQP_EVENTS_QUEUE_NAME, msg => msg && EventsQueue.next(
                {
                  payload: msg, 
                  ack: () => channel.ack(msg)
                }
                ), {noAck: false})
              )
          })
        )
      )
  })

  return EventsQueue;
}


module.exports = {
  Broker,
  getDeviceQueue,
}