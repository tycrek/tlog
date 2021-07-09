const C = console;
const { DateTime } = require('luxon');
const { Stream } = require('stream');
const chalk = require('chalk');
const AvailableColours = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];

//#region Constants
const STD = {
	out: process.stdout,
	err: process.stderr,
};

const CHARS = {
	EOL: require('os').EOL,
	ESCAPE: '\u001b',
	EMPTY: '',
	SPACE: ' '
};

let OPTIONS = {
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	timestamp: {
		enabled: true,
		colour: 'white',
		preset: null, // https://moment.github.io/luxon/#/formatting?id=presets
		format: null // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
	},
	label: {
		enabled: true,
		pad: true,
		case: 'upper'
	},
	title: {
		delim: ': '
	},
	extra: {
		prefix: ' (',
		suffix: ')'
	},
	comments: {
		char: '//',
		colour: 'grey'
	}
};

const LOG = {
	LEVELS: {
		debug: 100,
		info: 200,
		warn: 300,
		error: 400,
		success: 100
	},
	COLOURS: {
		debug: 'white',
		info: 'cyan',
		warn: 'yellow',
		error: 'red',
		success: 'green',
	},
	TITLES: {
		debug: '[DEBUG]',
		info: '[INFO]',
		warn: '[WARN]',
		error: '[ERROR]',
		success: '[SUCCESS]',
	},
	SPACES: {
		debug: '   ',
		info: '    ',
		warn: '    ',
		error: '   ',
		success: ' ',
	}
};
//#endregion

//#region Output functions
/**
 * Write to stdout
 * @param {Stream} std The Stream to write to
 * @param {...*} args The objects to write
 */
function w(std, ...args) {
	std.write(args.join(CHARS.EMPTY).concat(CHARS.EOL));
}

/**
 * Write to stdout
 * @param {...*} args The objects to write
 */
function wout(...args) {
	w(STD.out, ...args);
}

/**
 * Write to stderr
 * @param {...*} args The objects to write
 */
function werr(...args) {
	w(STD.err, ...args);
}
//#endregion

class TLog {
	/**
	 * The colours users can set
	 * @see {@link AvailableColours}
	 * @readonly
	 * @public
	 * @static
	 */
	static AvailableColours = AvailableColours;

	/**
	 * Staticly exposed console, in case you wanted to use it
	 * @readonly
	 * @public
	 * @static
	 */
	static console = C;
	static c = C;

	/**
	 * Non-static exposed console, in case you wanted to call it from your TLog instance
	 * @readonly
	 * @public
	 */
	console = C;
	c = C;

	/**
	 * The options the logger will use
	 * @type {object}
	 * @private
	 */
	#options = {};

	/**
	 * Create a new instance of TLog
	 * @param {object} {@link OPTIONS options} The options to use
	 */
	constructor(options = OPTIONS) {
		this.#options = Object.assign({}, OPTIONS, options);
	}

	/**
	 * Generate a log-ready timestamp
	 * @return {string} A timestamp, with colours & formatting (if enabled)
	 * @private
	 */
	#getTimestamp() {
		const timestamp = this.#options.timestamp;
		return timestamp.enabled
			? chalk[timestamp.colour](timestamp.format
				? DateTime.now().toFormat(timestamp.format)
				: timestamp.preset
					? DateTime.now().toLocaleString(DateTime[timestamp.preset])
					: DateTime.now().toISO())
				.concat(CHARS.SPACE)
			: CHARS.EMPTY;
	}

	/**
	 * Generate a log-ready label
	 * @param {string} level The log level
	 * @return {string} A label, with colours & formatting (if enabled)
	 * @private
	 */
	#getLabel(level) {
		const label = this.#options.label;
		return label.enabled
			? chalk[LOG.COLOURS[level]].inverse(LOG.TITLES[level][label.case === 'upper' ? 'toUpperCase' : 'toLowerCase']()) + (label.pad ? LOG.SPACES[level] : CHARS.SPACE)
			: CHARS.EMPTY;
	}

	/**
	 * Generate a log-ready title
	 * @param {string} level The log level
	 * @param {string} title The log title
	 * @param {string} message The log message
	 * @return {string} A title, with colours & formatting (if set)
	 * @private
	 */
	#getTitle(level, title, message) {
		return chalk[LOG.COLOURS[level]].bold(message ? `${title}${this.#options.title.delim}` : CHARS.EMPTY);
	}

	/**
	 * Generate a log-ready message
	 * @param {string} level The log level
	 * @param {string} title The log title
	 * @param {string} message The log message
	 * @return {string} A message, with colours & formatting
	 * @private
	 */
	#getMessage(level, title, message) {
		return chalk[LOG.COLOURS[level]](message || title);
	}

	/**
	 * Generate a log-ready extra
	 * @param {string} level The log level
	 * @param {string} extra The log extra
	 * @return {string} An extra, with colours & formatting (if set)
	 * @private
	 */
	#getExtra(level, extra) {
		return chalk[LOG.COLOURS[level]].italic(extra ? `${this.#options.extra.prefix}${extra}${this.#options.extra.suffix}` : CHARS.EMPTY);
	}

	/**
	 * Prints a formatted log message
	 * @param {string} level The log level
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @private
	 * @chainable
	 */
	#log(level, title, message, extra) {
		if (LOG.LEVELS[level] >= LOG.LEVELS[this.#options.level])
			(level === 'warn' || level === 'error' ? werr : wout)(
				this.#getTimestamp() +
				this.#getLabel(level) +
				this.#getTitle(level, title, message) +
				this.#getMessage(level, title, message) +
				this.#getExtra(level, extra));
		return this;
	}

	/**
	 * Prints a utility log, with colours & formatting
	 * @param {string} title The log title
	 * @param {string} data The log data
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @private
	 * @chainable
	 */
	#utilLog(title, data, extra) {
		wout(chalk.white.bold(`${title}: `).concat(chalk.white(data), chalk.grey(extra ? ` (${extra})` : CHARS.EMPTY)));
		return this;
	}

	/**
	 * A generic chainable log method. Acts like a console.log short-hand (but using process.stdout)
	 * @param {...*} args The objects to write
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	log(...args) {
		wout(...args);
		return this;
	}

	/**
	 * Prints a formatted debug log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	debug(title, message, extra) {
		return this.#log('debug', title, message, extra);
	}

	/**
	 * Prints a formatted info log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	info(title, message, extra) {
		return this.#log('info', title, message, extra);
	}

	/**
	 * Prints a formatted warn log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	warn(title, message, extra) {
		return this.#log('warn', title, message, extra);
	}

	/**
	 * Prints a formatted error log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	error(title, message, extra) {
		return this.#log('error', title, message, extra);
	}

	/**
	 * Prints a formatted success log message
	 * @param {string} [title] The log title (optional)
	 * @param {string} message The log message
	 * @param {string} [extra] The log extra (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	success(title, message, extra) { return this.#log('success', title, message, extra); }

	/**
	 * Prints a formatted comment log message
	 * @param {string} message The log message
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	comment(message) {
		wout(chalk[this.#options.comments.colour](`${this.#options.comments.char} ${message}`));
		return this;
	}

	/**
	 * Prints the type of an object
	 * @param {object} obj The object to print the type of
	 * @param {string} [title] The log title (optional, defaults to 'Typeof')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	typeof(obj, title = 'Typeof') {
		const type = (Object.prototype.toString.call(obj).match(/(?<= )(.*?)(?=\])/gi) || ['Unknown'])[0];
		this.#utilLog(title, type);
		return this;
	}

	/**
	 * Prints the current Unix epoch in milliseconds
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://moment.github.io/luxon/api-docs/index.html#datetimetomillis}
	 */
	epoch() {
		this.#utilLog('Epoch', DateTime.now().toMillis(), 'milliseconds');
		return this;
	}

	/**
	 * Prints if the current console is a TTY
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_istty}
	 * 
	 */
	isTTY() {
		this.#utilLog('Is TTY', process.stdout.isTTY);
		return this;
	}

	/**
	 * Prints the terminal size, in columns & rows
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_columns}
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_rows}
	 */
	windowSize() {
		this.#utilLog('Window Size', `${process.stdout.columns} x ${process.stdout.rows}`, 'columns x rows');
		return this;
	}

	/**
	 * Prints the current process ID
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_pid}
	 */
	pid() {
		this.#utilLog('Process ID', process.pid);
		return this;
	}

	/**
	 * Prints the current working directory
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_cwd}
	 */
	cwd() {
		this.#utilLog('Current Working Directory', process.cwd());
		return this;
	}

	/**
	 * Prints the Node.js version
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_version}
	 */
	node() {
		this.#utilLog('Node', process.version);
		return this;
	}

	/**
	 * Prints the command line arguments
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_argv}
	 */
	argv() {
		this.#utilLog('Command line args', process.argv.slice(1));
		return this;
	}

	/**
	 * Prints the environment variables
	 * @param {string} [key] The environment variable key to print (optional)
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 * @see {@link https://nodejs.org/api/process.html#process_process_env}
	 */
	env(key) {
		this.#utilLog(key ? `env.${key}` : 'Environment variables', key ? process.env[key] : process.env);
		return this;
	}

	/**
	 * Prints a stringified object
	 * @param {object} obj The object to stringify
	 * @param {string} [title] The log title (optional, defaults to 'Stringify')
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	stringify(obj, title = 'Stringify') {
		this.#utilLog(title, JSON.stringify(obj, null, 2));
		return this;
	}

	/**
	 * Prints a blank line
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	blank() {
		wout();
		return this;
	}

	/**
	 * Clears the console
	 * @return {TLog} This instance of TLog
	 * @public
	 * @chainable
	 */
	clear() {
		wout(`${CHARS.ESCAPE}[2J${CHARS.ESCAPE}[H`);
		return this;
	}
}

module.exports = TLog;
