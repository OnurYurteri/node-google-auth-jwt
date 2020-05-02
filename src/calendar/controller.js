const GoogleClient = require('../app/google-client');
const logger = require('../logger/service').calendar;

exports.getEvents = async (req, res) => {
  const googleToken = req.googleToken;
  logger.info(`controller::getEvents::googleToken::${JSON.stringify(googleToken)}::{}`);
  try {
    const data = await GoogleClient.getEvents(googleToken);
    res.status(200).json({ status: 200, message: 'Success!', data });
  } catch (e) {
    logger.error(`controller::getEvents::from::${e.from}::message::${e.message}::{}`);
    return res
      .status(500)
      .json({ status: 500, message: 'Unexcepted error occured, please try again later.' });
  }
};
