require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../logger/service').app;

const exprsInSec = parseInt(process.env.JWT_TOKEN_EXPR_SEC, 10) || 30;

exports.createToken = async (user) => {
  const userObj = user;
  delete userObj.pass;
  delete userObj.googleToken;
  logger.info(`service::createToken::user::${JSON.stringify(userObj)}::{}`);
  try {
    return jwt.sign(userObj, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: exprsInSec,
    });
  } catch (e) {
    e.from = 'app_service_createToken';
    throw e;
  }
};
