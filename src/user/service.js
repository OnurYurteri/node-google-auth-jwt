const logger = require('../logger/service').user;
const User = require('./model');

// eslint-disable-next-line no-unused-vars
exports.getUsers = async (query, page, limit) => {
  logger.info(
    `service::getUsers::query::${JSON.stringify(query)}::page::${page}::limit::${limit}::{}`
  );
  try {
    const users = await User.find(query);
    return users;
  } catch (e) {
    e.from = 'user_service_getUsers';
    throw e;
  }
};

exports.getUserWithEmail = async (email) => {
  logger.info(`service::getUserWithEmail::email::${email}::{}`);
  try {
    const query = { email };
    const user = await User.findOne(query);
    return user;
  } catch (e) {
    e.from = 'user_service_getUserWithEmail';
    throw e;
  }
};

exports.create = async (email, pass, name, surname) => {
  logger.info(
    `service::create::email::${email}::pass::${pass}::name::${name}::surname::${surname}::{}`
  );
  const document = new User({ email, pass, name, surname });

  try {
    const user = await document.save();
    return user;
  } catch (e) {
    e.from = 'user_service_create';
    throw e;
  }
};

exports.createWithGoogle = async (googleUser, googleToken) => {
  const email = googleUser.emailAddresses[0].value;
  const name = googleUser.names[0].givenName;
  const surname = googleUser.names[0].familyName;
  logger.info(
    `service::createWithGoogle::email::${email}::name::${name}::surname::${surname}::googleUser::${googleUser}::googleToken::${JSON.stringify(
      googleToken
    )}::{}`
  );
  const document = new User({ email, name, surname, googleToken });

  try {
    const user = await document.save();
    return user;
  } catch (e) {
    e.from = 'user_service_createWithGoogle';
    throw e;
  }
};

exports.getGoogleTokenWithEmail = async (email) => {
  logger.info(`service::getGoogleTokenWithEmail::email::${email}::{}`);
  try {
    const token = await User.findOne({ email }, { googleToken: 1 });
    return token.toObject();
  } catch (e) {
    e.from = 'user_service_getGoogleTokenWithEmail';
    throw e;
  }
};
