const mongoose = require("mongoose");
const { mongoUri } = require("./env.");

mongoose.connect(mongoUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    useFindAndModify: false,
});

module.exports = mongoose.connection;