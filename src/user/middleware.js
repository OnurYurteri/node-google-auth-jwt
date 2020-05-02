const UserService = require('./service');
const logger = require('../logger/service').user;

exports.setGoogleTokenToRequestWithEmail = async (req, res, next) => {
  logger.info(`middleware::setGoogleTokenToRequestWithEmail::email::${req.user.email}::{}`);
  try {
    const { googleToken } = await UserService.getGoogleTokenWithEmail(req.user.email);
    req.googleToken = googleToken;
    return next();
  } catch (e) {
    logger.error(
      `middleware::setGoogleTokenToRequestWithEmail::from::${e.from}::message::${e.message}`
    );
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};
