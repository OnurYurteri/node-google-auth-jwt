const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const logger = require('../logger/service').app;

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
];

// eslint-disable-next-line camelcase
const { client_id, client_secret, redirect_uris } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'credentials', 'google.json'))
).web;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const people = google.people({ version: 'v1' }).people;
const calendar = google.calendar({ version: 'v3' });

/* USER AND PROFILING */
exports.retriveUserData = async (tokens) => {
  logger.info(`google-client::retriveUserData::tokens::${JSON.stringify(tokens)}::{}`);
  oAuth2Client.setCredentials(tokens);
  try {
    const me = await people.get({
      auth: oAuth2Client,
      resourceName: 'people/me',
      personFields: [
        'emailAddresses',
        'names',
        'ageRanges',
        'birthdays',
        'locales',
        'genders',
        'phoneNumbers',
        'photos',
      ],
    });
    return me.data;
  } catch (e) {
    e.from = 'app_google-client_retriveUserData';
    throw e;
  }
};

exports.getAuthUrl = () => {
  logger.info(`google-client::getAuthUrl::{}`);
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
};

/* CALENDAR */

exports.getEvents = async (tokens) => {
  oAuth2Client.setCredentials(tokens);
  try {
    const res = await calendar.events.list({
      auth: oAuth2Client,
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 30,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data;
  } catch (e) {
    e.from = 'app_google-client_getEvents';
    throw e;
  }
};

exports.oAuth2Client = oAuth2Client;
