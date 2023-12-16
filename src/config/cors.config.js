import httpStatus from 'http-status-codes';
import cors from "cors";
import APIError from '../utils/APIError.js';

const options = {
	origin: (origin, callback) => {
		const whiteList = ['localhost', 'chrome-extension'];

		const index = whiteList.findIndex((aWhiteListedOrigin) => origin.includes(aWhiteListedOrigin));
		if (!origin || index !== -1) {
			callback(null, true);
		} else {
			const error = {
				message: `'${origin}' is not allowed to access the specified route/resource`,
				status: httpStatus.FORBIDDEN,
			};
			callback(new APIError(error), false);
		}
	},
	credentials: false,
};

function corsFunction() {
  return cors(options);
}

export default corsFunction;
