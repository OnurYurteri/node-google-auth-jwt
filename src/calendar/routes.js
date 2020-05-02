const express = require('express');
const AppMiddleware = require('../app/middleware');
const UserMiddleware = require('../user/middleware');

const router = express.Router();

const CalendarController = require('./controller');

router.get(
  '/',
  AppMiddleware.verifyToken,
  AppMiddleware.checkDbConnection,
  UserMiddleware.setGoogleTokenToRequestWithEmail,
  CalendarController.getEvents
);

module.exports = router;
