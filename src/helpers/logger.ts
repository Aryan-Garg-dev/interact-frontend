import { createLogger, format, transports } from 'winston';

const formatConfig = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.json(),
  format.prettyPrint(),
  format.errors({ stack: true })
);

const devFormatConfig = format.combine(
  format.timestamp({
    format: 'HH:mm:ss',
  }),
  format.json(),
  format.simple(),
  format.colorize(),
  format.prettyPrint(),
  format.errors({ stack: true })
);

const logger = createLogger({
  transports: [
    // new transports.File({
    //   filename: `logs/error.log`,
    //   level: 'error',
    //   format: formatConfig,
    // }),
    // new transports.File({
    //   filename: `logs/info.log`,
    //   level: 'info',
    //   format: formatConfig,
    // }),
    new transports.Console({
      format: devFormatConfig,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: devFormatConfig,
    })
  );
}

export default logger;
