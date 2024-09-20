import winston, { format, createLogger, transports } from "winston";
import formatTimestamp from "../../utils/time-now";
const { combine, timestamp, printf, colorize } = format;
import path from "path";
type LogLevel = "error" | "warn" | "info" | "debug";
const customFormat = printf(({ level, message, timestamp }) => {
  return `[ ${formatTimestamp(timestamp)} ] -  ${level} -  ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), customFormat),

  transports: [
    new transports.Console(),
    new winston.transports.File({
      filename: path.join("logs", "response.log"),
    }),
  ],
});

export { logger };
