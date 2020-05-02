const jwt = require('jsonwebtoken');
const logger = require('../logger/service').app;
const mongoConnection = require('./db').connection;
const { oAuth2Client, retriveUserData } = require('./google-client');

const { NODE_ENV } = process.env;

exports.defaultPathHandler = (req, res) => {
  if (NODE_ENV === 'development') {
    const message = {
      node: `${process.env.INSTANCE ? process.env.INSTANCE : 'standalone'}`,
      requestUrl: req.url,
      headers: JSON.stringify(req.headers),
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
    };
    return res.status(200).json({
      status: 200,
      message,
    });
  }

  logger.warn(
    `middleware::defaultPathHandler::method::${req.method}::requestUrl::${req.url}::Route is not supported!`
  );
  return res.status(404).json({
    status: 404,
    message: 'Route is not supported!',
  });
};

exports.invalidRequest = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ status: 400, message: err.message });
  }
  return next();
};

exports.checkDbConnection = (req, res, next) => {
  const val = mongoConnection.readyState;
  if (val !== 1) {
    logger.error(
      `middleware::checkConnectionMiddleware::on::${req.originalUrl}::Mongo is not connected!`
    );
    res
      .status(400)
      .json({ status: 500, message: 'Unexpected error occured, please try again later.' });
    return;
  }
  next();
};

exports.verifyToken = async (req, res, next) => {
  logger.info(
    `middleware::verifyToken::originalUrl::${req.originalUrl}::reqHeaders::${JSON.stringify(
      req.headers
    )}::{}`
  );
  const bearerHeader = req.headers['x-api-token'];
  if (!bearerHeader) {
    logger.info('middleware::verifyToken::Token is not given');
    res.sendStatus(403);
    return;
  }

  req.token = bearerHeader;

  jwt.verify(req.token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.info('middleware::verifyToken::Token unauthorized');
      res.sendStatus(401);
      return;
    }
    req.user = user;
    logger.info('middleware::verifyToken::Authorized');
    next();
  });
};

exports.setUserDataFromGoogleWithCode = async (req, res, next) => {
  // TODO: Update it to new token?
  const code = req.query.code;
  logger.info(`middleware::setUserDataFromGoogleWithCode::code::${code}::{}`);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    req.googleToken = tokens;
    req.googleUser = await retriveUserData(tokens);
    next();
  } catch (e) {
    e.from = 'app_middleware_setUserDataFromGoogleWithCode';
    throw e;
  }
};
