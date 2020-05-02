const UserService = require('./service');
const createToken = require('../app/service').createToken;
const logger = require('../logger/service').user;
const googleClient = require('../app/google-client');

exports.create = async (req, res) => {
  logger.debug(`controller::create::requestBody::${JSON.stringify(req.body)}::{}`);
  logger.info(`controller::create::email::${JSON.stringify(req.body.email)}::{}`);
  try {
    const user = await UserService.create(
      req.body.email,
      req.body.pass,
      req.body.name,
      req.body.surname
    );
    const token = await createToken(user.toObject());
    return res.status(200).json({ status: 200, token });
  } catch (e) {
    logger.error(`controller::create::from::${e.from}::message::${e.message}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};

exports.login = async (req, res) => {
  logger.debug(`controller::login::requestBody::${JSON.stringify(req.body)}::{}`);
  logger.info(`controller::login::email::${req.body.email}::{}`);
  try {
    const user = await UserService.getUserWithEmail(req.body.email);
    if (!user) {
      logger.info(`controller::login::email::${req.body.email}::User not found!`);
      return res.status(200).json({ status: 200, message: 'User not found!' });
    }

    const result = await user.passwordMatches(req.body.pass);
    if (result) {
      const token = await createToken(user.toObject());
      logger.info(`controller::login::email::${req.body.email}::Login successfully!`);
      return res.status(200).json({ status: 200, message: 'Login successfully!', token });
    }

    logger.info(`controller::login::email::${req.body.email}::Invalid password!`);
    return res.status(200).json({ status: 200, message: 'Invalid password!' });
  } catch (e) {
    logger.error(`controller::login::from::${e.from}::message::${e.message}::{}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};

exports.getUsers = async (req, res) => {
  logger.info(
    `controller::getUsers::reqQuery::${JSON.stringify(req.query)}::by::${req.user.email}::{}`
  );

  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  try {
    const users = await UserService.getUsers({}, page, limit);
    logger.info(`controller::getUsers::by::${req.user.email}::Users succesfully retrieved!`);
    return res.status(200).json({
      status: 200,
      data: users,
      user: req.user,
      message: 'Users succesfully retrieved!',
    });
  } catch (e) {
    logger.error(`controller::getUsers::from::${e.from}::message::${e.message}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};

exports.getGoogleAuthUrl = async (req, res) => {
  logger.info(`controller::getGoogleAuthUrl::{}`);
  try {
    const authUrl = googleClient.getAuthUrl();
    return res.status(200).json({
      status: 200,
      message: 'Go to the url to continue!',
      data: authUrl,
    });
  } catch (e) {
    logger.error(`controller::getGoogleAuthUrl::from::${e.from}::message::${e.message}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};

exports.getGoogleRedirect = async (req, res) => {
  const googleUser = req.googleUser;
  const googleToken = req.googleToken;
  const email = googleUser.emailAddresses[0].value;
  let user;

  try {
    user = await UserService.getUserWithEmail(email);
  } catch (e) {
    logger.error(`controller::getGoogleRedirect::from::${e.from}::message::${e.message}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }

  if (!user) {
    try {
      user = await UserService.createWithGoogle(googleUser, googleToken);
    } catch (e) {
      logger.error(`controller::getGoogleRedirect::from::${e.from}::message::${e.message}`);
      return res
        .status(500)
        .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
    }
  }

  try {
    const token = await createToken(user.toObject());
    return res.status(200).json({ status: 200, token });
  } catch (e) {
    logger.error(`controller::getGoogleRedirect::from::${e.from}::message::${e.message}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};
