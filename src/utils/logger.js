import { createLogger, format, transports } from 'winston';
import path from 'path';

const colors = {
	trace: 'white',
	debug: 'blue',
	info: 'green',
	warn: 'yellow',
	crit: 'red',
	fatal: 'red',
};

const options = (prefix) => ({
	level: 'debug',
	format: format.combine(
		format.label({ label: path.basename(prefix) }),
		format.colorize({ colors }),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf((info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
	),
	transports: [
		new transports.Console(),
	],
});

const logger = createLogger(options(import.meta.url));

export default logger;
