import winston from "winston";
import fs from "fs";

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

/* -------- Console Format (Readable) -------- */

const consoleFormat = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaString =
      Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";

    return `${timestamp} ${level}: ${message} ${metaString}`;
  })
);

/* -------- File Format (Structured JSON) -------- */

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

/* -------- Logger -------- */

const logger = winston.createLogger({
  level: "info",
  format: fileFormat,

  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "logs/combined.log"
    })
  ]
});

/* -------- Console Transport (Dev Only) -------- */

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat
    })
  );
}

export default logger;