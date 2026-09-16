import path from 'path';
import winston from 'winston';

const logFileName = path.join(__dirname, '../../', 'logs/app.log');
const errorLogFileName = path.join(__dirname, '../../', 'logs/error.log');


let logger: winston.Logger | null = null;

export async function initLogger(): Promise<void> {
    try {
        logger = await winston.createLogger({
            format: winston.format.json(),
            exceptionHandlers: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: errorLogFileName,
                    level: 'error'
                })
            ],
            transports: [
                new winston.transports.Console(),
                // new winston.transports.File({
                //     filename: logFileName
                // })
            ]
        });
    } catch (err) {
        throw err;
    }
}

export function logInfo(message: string, data?: Record<string, any>): void {
    logger?.log('info', message, data);
}

export function logError(message: string, data?: Record<string, any>): void {
    logger?.log('error', message, data);
}

export function logWarn(message: string, data?: Record<string, any>): void {
    logger?.log('warn', message, data);
}

export function logDebug(message: string, data?: Record<string, any>): void {
    logger?.log('debug', message, data);
}

export function logSilly(message: string, data?: Record<string, any>): void {
    logger?.log('silly', message, data);
}
