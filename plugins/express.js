/**
* For Express.js (visit {@link http://expressjs.com})
*/

const TLog = require('../tlog');
const chalk = require('chalk');

const TITLE = 'Express';
const OPTIONS = {};
const LABEL = (colour = 'green') => chalk[colour].inverse(`[${TITLE}]`);
const code2colour = { 1: 'cyan', 2: 'green', 3: 'cyan', 4: 'yellow', 5: 'red' };

class Express {
	/**
	 * @type {TLog}
	 * @private
	 */
	#tlog = null;

	/**
	 * This plugins options
	 * @type {object}
	 * @private
	 */
	#options = {};

	/**
	 * Creates a new Express.js logging middleware plugin
	 * @param {TLog} tlog The parent logger instance
	 */
	constructor(tlog) {
		this.#tlog = tlog;
		this.#options = Object.assign({}, OPTIONS);
	}

	/**
	 * Uses Chalk to build a log-ready String
	 * @param {string} [title] The title of the log (Optional)
	 * @param {string} message The message of the log
	 * @param {string} [extra] The extra data for the log (Optional)
	 * @param {string} [colour] The colour of the log (Optional, defaults to 'green')
	 * @returns {string} The log-ready String
	 * @private
	 */
	#buildExpressLog(title, message, extra, colour = 'green') {
		return `${LABEL(colour)} ${message ? chalk[colour].bold(title.concat(': ')) : ''}${message || ''} ${extra ? chalk.italic(`(${extra})`) : ''}`;
	}

	/**
	 * Hosts the provided Express app on the specified port
	 * @param {*} app The Express app
	 * @param {number} port The port to host the Express app on
	 * @param {string} host The host to host the Express app on (example: '0.0.0.0')
	 * @param {function} [callback] The callback to invoke when the Express app is hosted (Optional)
	 * @public
	 */
	Host(app, port, host, callback = null) {
		// 404 Handler
		app.use((req, res, _next) =>
			this.#tlog.log(this.#buildExpressLog('Not found', req.url, '404', 'yellow')).callback(() => res.sendStatus(404)));

		// 500 Handler
		app.use((err, _req, res, _next) =>
			this.#tlog.log(this.#buildExpressLog('Response error', err, '500', 'red')).err(err).callback(() => res.sendStatus(500)));

		// Host the Express app
		app.listen(port, host, () =>
			this.#tlog.log(this.#buildExpressLog(
				'Express started',
				`Listening on ${host}:${port}`,
				`click http://127.0.0.1:${port}/`))
				.callback(callback));
		// todo: add methods for 4xx, 5xx, etc. (right now both this and test.js output logs)
	}

	/**
	 * Logs the request URL for every request of an Express app
	 * @param {object} req The Express request
	 * @param {object} res The Express response
	 * @param {function} next The Express next middleware
	 * @public
	 */
	use(req, res, next) {
		this.#tlog.log(this.#buildExpressLog(`HTTP ${req.method}`, req.url));
		res.on('finish', () => this.#tlog.log(this.#buildExpressLog('Response', res.statusCode, undefined, code2colour[`${res.statusCode}`.slice(0, 1)])));
		next();
	}

	/**
	 * Sets an option for this Express plugin
	 * @param {string} option The option to change
	 * @param {*} value The value to set the option to
	 * @return {Express} For chaining Express plugin methods after setting an option, or for setting more options
	 * @public
	 */
	set(option, value) {
		this.#options[option] = value;
		return this;
	}

	/**
	 * Logs the User Agent of the request
	 * @param {object} req The Express request
	 * @public
	 */
	UserAgent(req) {
		this.#tlog.log(this.#buildExpressLog('User-Agent', req.headers['user-agent']));
	}

	/**
	 * Logs a specific header of the request.
	 * @param {object} req The Express request
	 * @param {string} [header] The header to log (Optional, defaults to 'user-agent')
	 * @public
	 */
	Header(req, header = 'user-agent') {
		this.#tlog.log(this.#buildExpressLog(`Header ${header}`, req.header(header)));
	}
}

module.exports = Express;
