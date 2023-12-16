import express from 'express'
import compress from 'compression';
import helmet from 'helmet';
import tmp from 'tmp'
import cors from './cors.config.js';
import * as error  from '../api/middlewares/error.js';
import clientLogs from './client-log.config.js';
import routes from '../api/routes/v1/index.js';

BigInt.prototype.toJSON = function() { return this.toString(); }

/**
 * Express instance
 * @public
 */
const app = express();

// This middleware take care of the origin when the origin is undefined.
// origin is undefined when request is local
app.use((req, _, next) => {
	req.headers.origin = req.headers.origin || req.headers.host;
	next();
});

// CORS configuration
app.use(cors());

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

app.use('/api/v1', routes);
app.use('/api/client-log', clientLogs);

/**
 * App Configurations
 */

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

// temporary files created using tmp will be deleted on UncaughtException
tmp.setGracefulCleanup();

export default app;
