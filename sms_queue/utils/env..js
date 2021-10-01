require('dotenv').config()

module.exports = {
    AMQP_URI: process.env.AMQP_URI || 'device.nextronic.io',
    AMQP_EVENTS_EX_NAME: process.env.AMQP_EVENTS_EX_NAME,
    AMQP_EVENTS_QUEUE_NAME: process.env.AMQP_EVENTS_QUEUE_NAME,
    AMQP_EVENTS_ROUTING: process.env.AMQP_EVENTS_ROUTING,
    mongoUri: process.env.MONGO_URI,
    graylogHost: process.env.LOG_HOST || 'localhost',
    graylogPort: process.env.LOG_PORT || 12201,
    graylogProto: process.env.LOG_PROTO || 'udp',
    wsUrl: process.env.WS_URL
}