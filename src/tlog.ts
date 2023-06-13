import { wout, werr, Chars } from './printer';
import { Level } from './Levels';
import { TLTimestamp, TLLabel, TLTitle, TLExtra, TLComments } from './Options';
import { LOG } from './LOG';
import { DateTime } from 'luxon';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Chalk from 'chalk';

/**
 * Chalk instance, in case you want to use it. 
 * 
 * **Please note:** tlog is using Chalk `4.1.2`, NOT Chalk `5.x.x`
 */
export const chalk = new Chalk.Instance();

/**
 * TLog class. Use with `new TLog()` to get started.
 */
export class TLog {
	private _chalk: Chalk.Chalk;
	private level: Level;
	private timestamp: TLTimestamp;
	private label: TLLabel;
	private title: TLTitle;
	private extra: TLExtra;
	private comments: TLComments;

	/**
	 * Configure a new TLog instance. `level` is optional, defaulting to **`info`**.
	 */
	constructor(level: Level = 'info') {
		this._chalk = new Chalk.Instance();

		// Set level
		this.level = level;

		// Standard option defaults

		this.timestamp = {
			enabled: true,
			colour: 'grey',
			preset: DateTime.DATETIME_SHORT_WITH_SECONDS
		};

		this.label = {
			enabled: true,
			pad: true,
			case: 'upper',
			align: 'left'
		};

		this.title = {
			delim: ': '
		};

		this.extra = {
			prefix: '(',
			suffix: ')'
		};

		this.comments = {
			char: '#',
			colour: 'grey'
		};

		this.debug('TLog initialized');
	}

	//#region // * Private methods

	private getChalk(colour: string): Chalk.Chalk {
		return typeof (this._chalk as any)[colour] === 'function'
			? (this._chalk as any)[colour] as Chalk.Chalk
			: this._chalk.white;
	}

	private getTimestamp(): string {
		if (!this.timestamp.enabled) return Chars.EMPTY;

		const now = DateTime.local();
		const usePreset = this.timestamp.preset !== undefined;

		return this.getChalk(this.timestamp.colour!)((usePreset
			? now.toLocaleString(this.timestamp.preset)
			: now.toFormat(this.timestamp.format!))
			.concat(Chars.SPACE));
	}

	private getLabel(level: Level, chalk?: Chalk.Chalk): string {
		if (!this.label.enabled) return Chars.EMPTY;

		const getPadding = (align: 'left' | 'right') =>
			this.label.align === align && this.label.pad
				? LOG.SPACES[level]
				: Chars.EMPTY;

		const label = this.getChalk(LOG.COLOURS[level])
			.inverse(LOG.TITLES[level][`to${this.label.case === 'upper' ? 'Upp' : 'Low'}erCase`]());

		return `${getPadding('right')}${label}${getPadding('left')}`;
	}

	private getTitle(level: Level, details: { title: string, message?: string, chalk?: Chalk.Chalk }): string {
		return (details.chalk ?? this.getChalk(LOG.COLOURS[level])).bold(details.message ? `${details.title}${this.title.delim}` : Chars.EMPTY);
	}

	private getMessage(title: string, message?: string): string {
		return this.getChalk(LOG.COLOURS[this.level])(message ?? title);
	}

	private getExtra(extra?: string): string {
		return this.getChalk(LOG.COLOURS[this.level]).italic(extra ? `${Chars.SPACE}${this.extra.prefix}${extra}${this.extra.suffix}` : Chars.EMPTY);
	}

	private log(level: Level, details: { title: string, message?: string, extra?: string, chalk?: Chalk.Chalk }): this {
		if (LOG.LEVELS[level] >= LOG.LEVELS[this.level])
			(LOG.LEVELS[level] >= LOG.LEVELS.warn ? werr : wout)(
				this.getTimestamp(),
				this.getLabel(level, chalk), Chars.SPACE,
				this.getTitle(level, { ...details }),
				this.getMessage(details.title, details.message),
				this.getExtra(details.extra)
			);
		return this;
	}

	//#endregion
	//#region // * Option methods (public)

	public setLevel(level: Level): this {
		this.level = level;
		return this;
	}

	public setTimestamp(timestamp: Partial<TLTimestamp>): this {
		this.timestamp = { ...this.timestamp, ...timestamp };
		return this;
	}

	public setLabel(label: Partial<TLLabel>): this {
		this.label = { ...this.label, ...label };
		return this;
	}

	public setTitle(title: Partial<TLTitle>): this {
		this.title = { ...this.title, ...title };
		return this;
	}

	public setExtra(extra: Partial<TLExtra>): this {
		this.extra = { ...this.extra, ...extra };
		return this;
	}

	public setComments(comments: Partial<TLComments>): this {
		this.comments = { ...this.comments, ...comments };
		return this;
	}

	//#endregion
	//#region // * Standard logging methods (public)

	public debug(message: string): this;
	public debug(title: string, message: string): this;
	public debug(title: string, message: string, extra: string): this;
	public debug(title: string, message?: string, extra?: string) {
		return this.log('debug', { title, message, extra });
	}

	public info(message: string): this;
	public info(title: string, message: string): this;
	public info(title: string, message: string, extra: string): this;
	public info(title: string, message?: string, extra?: string) {
		return this.log('info', { title, message, extra });
	}

	public warn(message: string): this;
	public warn(title: string, message: string): this;
	public warn(title: string, message: string, extra: string): this;
	public warn(title: string, message?: string, extra?: string) {
		return this.log('warn', { title, message, extra });
	}

	public error(message: string): this;
	public error(title: string, message: string): this;
	public error(title: string, message: string, extra: string): this;
	public error(title: string, message?: string, extra?: string) {
		return this.log('error', { title, message, extra });
	}

	public fatal(message: string): this;
	public fatal(title: string, message: string): this;
	public fatal(title: string, message: string, extra: string): this;
	public fatal(title: string, message?: string, extra?: string) {
		return this.log('fatal', { title, message, extra });
	}

	public success(message: string): this;
	public success(title: string, message: string): this;
	public success(title: string, message: string, extra: string): this;
	public success(title: string, message?: string, extra?: string) {
		return this.log('success', { title, message, extra });
	}

	public utils(message: string): this;
	public utils(title: string, message: string): this;
	public utils(title: string, message: string, extra: string): this;
	public utils(title: string, message?: string, extra?: string) {
		return this.log('utils', { title, message, extra });
	}

	//#endregion
	//#region // * Special logging methods (public)

	public comment(...args: any[]): this {
		wout(this.getChalk(this.comments.colour)(`${this.comments.char} ${args.join(Chars.SPACE)}`));
		return this;
	}

	public basic(...args: any[]): this {
		wout(this.getTimestamp(), ' :: ', args.join(Chars.SPACE));
		return this;
	}

	public blank(): this {
		wout(Chars.EMPTY);
		return this;
	}

	public clear(): this {
		wout(`${Chars.ESCAPE}[2J${Chars.ESCAPE}[H`);
		return this;
	}

	public callback(callback?: any): this {
		if (callback && typeof callback === 'function') callback();
		return this;
	}

	//#endregion
	//#region // * Express middleware (public)

	/**
	 * Returns an Express middleware function that logs requests in the standard tlog style
	 */
	public express(options?: {

		/**
		 * An array of paths to exclude from logging
		 */
		excludePaths?: string[];

		/**
		 * An array of methods to exclude from logging
		 */
		excludeMethods?: string[];

		/**
		 * Configures path trimming
		 */
		trimPaths?: false | {

			/**
			 * The maximum allowed length of a path before it is trimmed
			 */
			maxLength: number;

			/**
			 * The delimiter to use when trimming a path
			 */
			delimiter: string;

		},

		/**
		 * Enables morgan mode, which logs requests in the morgan style. NOT FINISHED YET
		 */
		morganMode?: boolean;

	}): RequestHandler {
		const { excludePaths, excludeMethods, trimPaths, morganMode } = options || {};
		const ExpressChalks = ['cyan', 'green', 'cyan', 'yellow', 'red'].map(colour => this.getChalk(colour));

		/**
		 * Trims the provided string to a certain length, adding a delimiter in the middle.
		 */
		const trimString = (str: string) => !options || !options.trimPaths || str.length < options.trimPaths.maxLength ? str
			// ! The 3 concats are for readability. Deal with it.
			: ''.concat(str.substring(0, (options.trimPaths.maxLength - options.trimPaths.delimiter.length) / 2))
				.concat(options.trimPaths.delimiter)
				.concat(str.substring((str.length - options.trimPaths.maxLength / 2) + 1));

		return (req: Request, res: Response, next: NextFunction) => {

			// Skip if request PATH or METHOD is excluded
			if ((excludePaths && excludePaths.includes(req.path))
				|| (excludeMethods && excludeMethods.includes(req.method))) return next();

			// Begin timing
			const start = process.hrtime()[1];

			// Log on completion to get duration
			res.on('finish', () =>
				this.log('express' as Level, {
					title: `HTTP ${req.method}`,
					message: trimPaths ? trimString(req.path) : req.path,
					extra: `${res.statusCode} ${res.statusMessage} (${(process.hrtime()[1] - start) / 1000000}ms)`,
					chalk: ExpressChalks[Math.floor(res.statusCode / 100) - 1],
				}));

			// Call next middleware to avoid blocking
			next();
		};
	};

	//#endregion
	//#region // * Utility methods (public)

	public epoch(): this {
		return this.log('utils', { title: 'Epoch', message: `${Date.now().toString()}ms` });
	}

	public pid(): this {
		return this.log('utils', { title: 'Process ID', message: `${process.pid}` });
	}

	public uptime(): this {
		return this.log('utils', { title: 'Uptime', message: `${process.uptime().toString()}s` });
	}

	public cwd(): this {
		return this.log('utils', { title: 'Current Working Directory', message: `${process.cwd()}` });
	}

	//#endregion
}
