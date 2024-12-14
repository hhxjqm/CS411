import { createLogger, transports, format } from 'winston';
import { Request, Response, NextFunction} from 'express'

const formatter = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
})

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        formatter
    ),
    transports: [
        new transports.Console(),
    ],
})

const loggerMiddleware = function(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    next();
    res.on('finish', () => {
        const ms = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
}

export {loggerMiddleware, logger};

export default logger;