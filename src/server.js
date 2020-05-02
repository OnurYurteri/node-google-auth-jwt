require('dotenv').config();

/* Internal Services */
const App = require('./app').App;
const db = require('./app/db');
const logger = require('./logger/service').app;

db.connect();

const port = process.env.PORT || 3000;
App.listen(port, () => {
  logger.info(`server::listen::Server started to listening on port ${port}..`);
});
