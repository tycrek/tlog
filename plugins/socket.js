const { EOL } = require('os');
const net = require('net');
const TLog = require('../tlog');
const { mergeNoArray } = require('../deepMerge');
const { SOCKET_PORT: PORT } = require('../MagicNumbers.json');

const TITLE = 'Socket';
const HOST = '127.0.0.1';
let LOG_TITLE = `[${TITLE}:${HOST}:${PORT}]`;

/**
 * Fixes the plugin log title.
 * @param {string} host The user defined host.
 * @param {numer} port The user defined port
 */
function setTitleHostPort(host, port) {
	LOG_TITLE = `[${TITLE}:${host}:${port}]`;
}

/**
* Default options for the Socket plugin
* @see {@link Socket}
*/
const OPTIONS = {
	port: PORT,
	host: HOST
};

/**
 * tlog Socket plugin
 * A local socket to view the log output
 * @class
 */
class Socket {
	/**
	 * @type {OPTIONS}
	 * @static
	 */
	static DEFAULT_OPTIONS = OPTIONS;

	/**
	 * @type {TLog}
	 * @private
	 */
	#tlog = null;

	/**
	 * This plugins options
	 * @type {OPTIONS}
	 * @private
	 */
	#options = {};

	/**
	 * @type {net.Server}
	 * @private
	 */
	#server = null;

	/**
	 * Map of sockets using remote address as the key
	 * @type {Map}
	 * @private
	 */
	#sockets = new Map();

	/**
	 * Creates a new Socket plugin, which creates a local socket to view the log output
	 * @param {TLog} tlog The parent logger instance
	 * @param {OPTIONS} [options] The options to set
	 */
	constructor(tlog, options = OPTIONS) {
		this.#tlog = tlog;
		this.#options = mergeNoArray(OPTIONS, options);

		// Fix the log host and port
		setTitleHostPort(this.#options.host, this.#options.port);
	}

	/**
	 * Start the socket
	 * @param {Function} [callback] Callback to execute once the socket is listenting (optional)
	 * @param {...*} [args] Arguments to pass to the callback (optional)
	 */
	listen(callback = null, ...args) {
		this.#server = net
			.createServer({ allowHalfOpen: true })
			.once('listening', () => this.#tlog.debug(LOG_TITLE, 'Listening').callback(() => callback && callback(...args)))
			.on('error', (err) => err.message.includes('EADDRINUSE') ? this.#tlog.warn(LOG_TITLE, 'Port already in use on host, disabling Socket plugin').warn(`This warning can be ignored unless you know why it showed up. If you don't know why, just ignore it.`) : this.#tlog.debug(LOG_TITLE, 'Encountered error').err(err))
			.on('close', () => this.#tlog.debug(LOG_TITLE, 'Closing'))
			.on('connection', (conn) => this.#tlog
				.debug(LOG_TITLE, 'Client connected', conn.remoteAddress)
				.callback(() => conn
					.on('error', (err) => !err.message.includes('ECONNRESET') && C.error(LOG_TITLE, err))
					.on('close', () => this.#tlog.callback(() => this.#sockets.delete(conn.remoteAddress)).debug(LOG_TITLE, 'Client disconnected')))
				.callback(() => this.#sockets.set(conn.remoteAddress, conn)))
			.listen(this.#options.port, this.#options.host);
	}

	/**
	 * Sends a message to all connected clients
	 * @param {string} message The message to send
	 */
	broadcast(message) {
		this.#sockets.forEach((conn) =>
			conn.write(encodeURI(`${message}${EOL}`), (err) =>
				err && console.error(LOG_TITLE, err)));
	}
}

module.exports = Socket;
