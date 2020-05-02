const express = require('express');
const AppMiddleware = require('../app/middleware');
const validation = require('./validation');

const router = express.Router();

const UserController = require('./controller');

router.get(
  '/',
  AppMiddleware.verifyToken,
  AppMiddleware.checkDbConnection,
  UserController.getUsers
);

router.post(
  '/create',
  validation.create,
  validation.resolve,
  AppMiddleware.checkDbConnection,
  UserController.create
);

router.post(
  '/login',
  validation.login,
  validation.resolve,
  AppMiddleware.checkDbConnection,
  UserController.login
);

router.get('/google-auth-url', UserController.getGoogleAuthUrl);

router.get(
  '/google-redirect',
  AppMiddleware.setUserDataFromGoogleWithCode,
  UserController.getGoogleRedirect
);

module.exports = router;
