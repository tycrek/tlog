import { DEFAULTS, CHARS, TAB_SIZE, LOG } from './Constants';
import Options from './Options';
import { DateTime } from 'luxon';
import { WriteStream } from 'tty';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

// Plugin imports
import Express from './plugins/express';
import Process from './plugins/process';
import ExpressPluginOptions from './plugins/ExpressPluginOptions';
import ProcessPluginOptions from './plugins/ProcessPluginOptions';

interface PluginEnabler {
	express(options?: ExpressPluginOptions): TLog
	process(options?: ProcessPluginOptions): TLog
}

export const DateTimePreset = DateTime;

export function getChalk(colour: string): chalk.Chalk {
	let c = Object(chalk)[colour];
	return c ? c : chalk.white;
	// return Object(chalk).hasOwnProperty(colour) ? Object(chalk)[colour] : chalk.white;
}

export type Level = 'debug' | 'info' | 'warn' | 'error' | 'success' | 'utils';

export class TLog {
	private options = DEFAULTS;
	private expressPlugin?: Express;
	private processPlugin?: Process;

	//#region // * Output functions
	private writeToStream(std: WriteStream, ...args: any[]) {
		std.write(args.join(CHARS.EMPTY).concat(CHARS.EOL));
	}

	/**
	 * Writes to stdout
	 */
	private writeOut(...args: any[]) {
		this.writeToStream(process.stdout, ...args);
	}

	/**
	 * Writes to stderr
	 */
	private writeError(...args: any[]) {
		this.writeToStream(process.stderr, ...args);
	}

	/**
	 * Put together the final log message
	 */
	private write(level: Level, title = '', message = '', extra = ''): TLog {
		if (LOG.LEVELS[level] >= LOG.LEVELS[this.options.level])
			(level === 'warn' || level === 'error' ? this.writeError : this.writeOut).call(this,
				`${this.getTimestamp()}` +
				`${this.getLabel(level)}` + CHARS.SPACE +
				`${this.getTitle(level, title, message)}` +
				`${this.getMessage(level, title, message)}` +
				`${(extra != null) ? this.getExtra(level, extra) : CHARS.EMPTY}`);
		return this;
	}
	//#endregion

	/**
	 * Attempts to convert a value to a Boolean primitive
	 */
	private toBoolean(value: any) {
		return Boolean(value).valueOf();
	}

	/**
	 * Generate a log-ready timestamp
	 */
	private getTimestamp() {
		const timestamp = this.options.timestamp;
		return timestamp.enabled
			? getChalk(timestamp.colour)(timestamp.format
				? DateTime.now().toFormat(timestamp.format)
				: timestamp.preset
					? DateTime.now().toLocaleString(Object(DateTime)[timestamp.preset.toString()] ?? timestamp.preset)
					: DateTime.now().toISO())
				.concat(CHARS.SPACE)
			: CHARS.EMPTY;
	}

	/**
	 * Generate a log-ready label
	 */
	private getLabel(level: Level) {
		const label = this.options.label;
		return label.enabled
			? getPadding('right') + getChalk(LOG.COLOURS[level]).inverse(LOG.TITLES[level][label.case === 'upper' ? 'toUpperCase' : 'toLowerCase']()) + getPadding('left')
			: CHARS.EMPTY;

		function getPadding(align: 'left' | 'right') {
			return label.align === align && label.pad ? LOG.SPACES[level] : CHARS.EMPTY;
		}
	}

	/**
	 * Generate a log-ready title
	 */
	private getTitle(level: Level, title: string, message: string) {
		return getChalk(LOG.COLOURS[level]).bold(message ? `${title}${this.options.title.delim}` : CHARS.EMPTY);
	}

	/**
	 * Generate a log-ready message
	 */
	private getMessage(level: Level, title: string, message: string) {
		return getChalk(LOG.COLOURS[level])(message || title);
	}

	/**
	 * Generate a log-ready extra
	 */
	private getExtra(level: Level, extra: string) {
		return getChalk(LOG.COLOURS[level]).italic(extra ? `${CHARS.SPACE}${this.options.extra.prefix}${extra}${this.options.extra.suffix}` : CHARS.EMPTY);
	}

	/**
	 * Prints a utility log, with colours & formatting
	 */
	private utilLog(title: string, data: string, extra?: string) {
		this.writeOut(this, this.getTimestamp(), this.getLabel('utils').concat(CHARS.SPACE), chalk.white.bold(title).concat(data ? ': ' : CHARS.EMPTY, chalk.white(data || CHARS.EMPTY), chalk.grey(extra ? ` (${extra})` : CHARS.EMPTY)));
		return this;
	}

	constructor(options?: Options) {
		// todo: idk if this will actually work
		this.options = { ...DEFAULTS, ...options };
	}

	public callback(callback: Function, ...args: any[]) {
		if (callback) callback(...args);
		return this;
	}

	//#region // * Plugins
	public enable: PluginEnabler = {
		express: (options?: ExpressPluginOptions) => {
			this.expressPlugin = new Express(this, options);
			return this;
		},

		process: (options?: ProcessPluginOptions) => {
			this.processPlugin = new Process(this, options);
			this.processPlugin.listen();
			return this;
		}
	}

	/**
	 * Express.js middleware. Set `middleware` to true if this is being passed through app.use() (Optional, defaults to false)
	 */
	public express() {
		this.expressPlugin;
	}

	public middleware() {
		return (req: Request, res: Response, next: NextFunction) => this.expressPlugin!.use(req, res, next);
	}
	//#endregion

	/**
	 * A generic chainable log method. Acts like a console.log short-hand & with a timestamp (but using process.stdout)
	 */
	public log(...args: any[]) {
		this.writeOut(this, this.getTimestamp(), ...args);
		return this;
	}

	/**
	 * A generic chainable error log method. Acts like a console.error short-hand (but using process.stderr).
	 * Useful for printing errors as it will show the stack trace
	 */
	public err(...args: any[]) {
		const lastArg = args[args.length - 1];
		this.writeError(this, ...((lastArg instanceof Error) ? args.slice(0, -1).concat(lastArg.stack) : args));
		return this;
	}

	/**
	 * Prints a formatted debug log message
	 */
	public debug(message: string): TLog;
	public debug(title: string, message: string): TLog;
	public debug(title: string, message: string, extra: string): TLog;
	public debug(title?: string, message?: string, extra?: string) {
		return this.write('debug', title, message, extra);
	}

	/**
	* Prints a formatted info log message
	 */
	public info(message: string): TLog;
	public info(title: string, message: string): TLog;
	public info(title: string, message: string, extra: string): TLog;
	public info(title?: string, message?: string, extra?: string) {
		return this.write('info', title, message, extra);
	}

	/**
	 * Prints a formatted warn log message
	 */
	public warn(message: string): TLog;
	public warn(title: string, message: string): TLog;
	public warn(title: string, message: string, extra: string): TLog;
	public warn(title?: string, message?: string, extra?: string) {
		return this.write('warn', title, message, extra);
	}

	/**
	 * Prints a formatted error log message
	 */
	public error(message: string): TLog;
	public error(title: string, message: string): TLog;
	public error(title: string, message: string, extra: string): TLog;
	public error(title?: string, message?: string, extra?: string) {
		return this.write('error', title, message, extra);
	}

	/**
	 * Prints a formatted success log message
	 */
	public success(message: string): TLog;
	public success(title: string, message: string): TLog;
	public success(title: string, message: string, extra: string): TLog;
	public success(title?: string, message?: string, extra?: string) {
		return this.write('success', title, message, extra);
	}

	/**
	 * Prints a formatted comment log message
	 */
	public comment(message: string) {
		this.writeOut(this, getChalk(this.options.comments.colour)(`${this.options.comments.char} ${message}`));
		return this;
	}

	/**
	 * Prints the type of an object
	 */
	public typeof(obj: any, title = 'Typeof') {
		const type = (Object.prototype.toString.call(obj).match(/(?<= )(.*?)(?=\])/gi) || ['Unknown'])[0];
		this.utilLog(title, type);
		return this;
	}

	/**
	 * Prints the current Unix epoch in milliseconds
	 * @see {@link https://moment.github.io/luxon/api-docs/index.html#datetimetomillis}
	 */
	public epoch() {
		this.utilLog('Epoch', DateTime.now().toMillis().toString(), 'milliseconds');
		return this;
	}

	/**
	 * Prints if the current console is a TTY
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_istty}
	 */
	public isTTY() {
		this.utilLog('Is TTY', process.stdout.isTTY.toString());
		return this;
	}

	/**
	 * Prints the terminal size, in columns & rows
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_columns}
	 * @see {@link https://nodejs.org/api/tty.html#tty_writestream_rows}
	 */
	public windowSize() {
		this.utilLog('Window Size', `${process.stdout.columns} x ${process.stdout.rows}`, 'columns x rows');
		return this;
	}

	/**
	 * Prints the current process ID
	 * @see {@link https://nodejs.org/api/process.html#process_process_pid}
	 */
	public pid() {
		this.utilLog('Process ID', process.pid.toString());
		return this;
	}

	/**
	 * Prints the current working directory
	 * @see {@link https://nodejs.org/api/process.html#process_process_cwd}
	 */
	public cwd() {
		this.utilLog('Current Working Directory', process.cwd());
		return this;
	}

	/**
	 * Prints the Node.js version
	 * @see {@link https://nodejs.org/api/process.html#process_process_version}
	 */
	public node() {
		this.utilLog('Node', process.version);
		return this;
	}

	/**
	 * Prints the command line arguments
	 * @see {@link https://nodejs.org/api/process.html#process_process_argv}
	 */
	public argv() {
		this.utilLog('Command line args', process.argv.slice(1).join(' '));
		return this;
	}

	/**
	 * Prints the environment variables
	 * @see {@link https://nodejs.org/api/process.html#process_process_env}
	 */
	public env(key?: string) {
		this.utilLog(key === undefined ? 'Environment variables' : `env.${key}`, (key === undefined ? JSON.stringify(process.env, null, TAB_SIZE) : process.env[key]) ?? chalk.italic('undefined'));
		return this;
	}

	/**
	 * Prints a stringified object
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
	 */
	public stringify(obj: object, title = 'Stringify') {
		this.utilLog(title, JSON.stringify(obj, null, 2));
		return this;
	}

	/**
	 * Prints the process uptime
	 * @see {@link https://nodejs.org/api/process.html#process_process_uptime}
	 */
	public uptime() {
		this.utilLog('Uptime', process.uptime().toString(), 'seconds');
		return this;
	}

	/**
	 * Prints the boolean evaluation of a condition
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/valueOf}
	 */
	public boolean(condition: any, title = 'Boolean') {
		this.utilLog(title, this.toBoolean(condition).toString());
		return this;
	}

	/**
	 * Prints the message only if the condition is boolean-true.
	 */
	public true(condition: boolean, message: string) {
		if (this.toBoolean(condition)) this.utilLog('True', message);
		return this;
	}

	/**
	 * Prints the message only if the condition is boolean-false.
	 */
	public false(condition: boolean, message: string) {
		if (!this.toBoolean(condition)) this.utilLog('False', message);
		return this;
	}

	/**
	 * Prints one of two messages based on the condition
	 */
	public ifElse(condition: boolean, messageIfTrue = 'True', messageIfFalse = 'False') {
		this.utilLog('IfElse', this.toBoolean(condition) ? messageIfTrue : messageIfFalse);
		return this;
	}

	/**
	 * Prints if the variable is null or undefined. If it is not, nothing will print.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined}
	 */
	public null(variable: any, message?: string) {
		this.utilLog(variable === null ? 'Null' : variable === undefined ? 'Undefined' : 'NotNull', message || '');
		return this;
	}

	/**
	 * Prints a blank line
	 */
	public blank() {
		this.writeOut(this);
		return this;
	}

	/**
	 * Clears the console
	 */
	public clear() {
		this.writeOut(this, `${CHARS.ESCAPE}[2J${CHARS.ESCAPE}[H`);
		return this;
	}
}
