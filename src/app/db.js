require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../logger/service').app;

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_PORT,
  MONGO_INITDB_DATABASE,
} = process.env;

let { MONGO_HOSTNAME } = process.env;

/* Variable 'INSTANCE' is set by docker-compose
  IF exist: MONGO_HOSTNAME will be connected, set MONGO_HOSTNAME environment variable to name of your mongo 'service' in docker-compose.yml
  IF NOT exist: Means either we're not running with docker-compose or we're on development, set mongo MONGO_HOSTNAME_STANDALONE to 127.0.0.1 or wherever you want it to connect
  To run your local mongo with docker using same volume as you running on docker-compose, check: .mongo/start-local-mongo.sh.example
*/

if (!process.env.INSTANCE) {
  MONGO_HOSTNAME = process.env.MONGO_HOSTNAME_STANDALONE;
}

const url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}?authSource=admin`;

const connection = mongoose.connection;

connection.on('connecting', () => {
  logger.info(`db::onConnecting::Trying to connect to mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`);
});

connection.on('error', (err) => {
  logger.error(
    `db::onError::error::${JSON.stringify(
      err
    )}::Error from mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`
  );
});
connection.on('connected', () => {
  logger.info(`db::onConnected::Connected to mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`);
});
connection.once('open', () => {
  logger.info(`db::onOpen::Connection opened to mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`);
});
connection.on('reconnected', () => {
  logger.info(`db::onReconnect::Reconnected to mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`);
});
connection.on('disconnected', () => {
  logger.warn(`db::disconnected::Disconnected from mongo on ${MONGO_HOSTNAME}:${MONGO_PORT}`);
  this.connect();
});

exports.connect = () => {
  mongoose.connect(
    url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
    (err) => {
      if (err) {
        logger.error(`db::connect::error::${JSON.stringify(err)}::Cannot connect to mongo`);
      }
    }
  );
};

exports.connection = connection;
