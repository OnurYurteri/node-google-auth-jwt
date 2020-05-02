const { transports, createLogger, format } = require('winston');
const appRoot = require('app-root-path');

/*
LOGGING FORMAT
WHERE::WHAT::PARAM::paramValue::MESSAGE
WHERE['service', 'controller', 'routes', 'model']: Basically filename
WHAT: Function name
PARAM/paramValue: Whatever you want, as much as you want
MESSAGE: ALWAYS in the end
eg: logger.info('service::myFunction::variable1::value1::variable2::value2::Something happened, and this is my explanation')
*/

const winstonOptions = {
  file: {
    level: 'info',
    /* Insert this on 'exports'
    // filename: `${appRoot}/logs/domain.log`, */
    format: format.combine(format.timestamp(), format.json()),
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    format: format.combine(format.timestamp(), format.json()),
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const getLogger = (options) => {
  // eslint-disable-next-line new-cap
  return createLogger({
    transports: [new transports.File(options.file), new transports.Console(options.console)],
    exitOnError: false, // do not exit on handled exceptions
  });
};

const appLogger = getLogger({
  file: { ...winstonOptions.file, filename: `${appRoot}/logs/app.log` },
  console: { ...winstonOptions.console },
});

appLogger.stream = {
  write: (message) => {
    appLogger.info(message);
  },
};

exports.app = appLogger;

exports.calendar = getLogger({
  file: { ...winstonOptions.file, filename: `${appRoot}/logs/calendar.log` },
  console: { ...winstonOptions.console },
});

exports.user = getLogger({
  file: { ...winstonOptions.file, filename: `${appRoot}/logs/user.log` },
  console: { ...winstonOptions.console },
});
