import { wout, werr, Chars } from './printer';
import { Level } from './Levels';
import { TLTimestamp, TLLabel, TLTitle, TLExtra, TLComments } from './Options';
import { LOG } from './LOG';
import { DateTime } from 'luxon';
import Chalk from 'chalk';

export const chalk = new Chalk.Instance();

export class TLog {
	private _chalk: Chalk.Chalk;
	private level: Level;
	private timestamp: TLTimestamp;
	private label: TLLabel;
	private title: TLTitle;
	private extra: TLExtra;
	private comments: TLComments;

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

	private getLabel(level: Level): string {
		if (!this.label.enabled) return Chars.EMPTY;

		const getPadding = (align: 'left' | 'right') =>
			this.label.align === align && this.label.pad
				? LOG.SPACES[level]
				: Chars.EMPTY;

		const label = this.getChalk(LOG.COLOURS[level])
			.inverse(LOG.TITLES[level][`to${this.label.case === 'upper' ? 'Upp' : 'Low'}erCase`]());

		return `${getPadding('right')}${label}${getPadding('left')}`;
	}

	private getTitle(level: Level, title: string, message?: string): string {
		return this.getChalk(LOG.COLOURS[level]).bold(message ? `${title}${this.title.delim}` : Chars.EMPTY);
	}

	private getMessage(title: string, message?: string): string {
		return this.getChalk(LOG.COLOURS[this.level])(message ?? title);
	}

	private getExtra(extra?: string): string {
		return this.getChalk(LOG.COLOURS[this.level]).italic(extra ? `${Chars.SPACE}${this.extra.prefix}${extra}${this.extra.suffix}` : Chars.EMPTY);
	}

	private log(level: Level, title: string, message?: string, extra?: string) {
		if (LOG.LEVELS[level] >= LOG.LEVELS[this.level])
			(LOG.LEVELS[level] >= LOG.LEVELS.warn ? werr : wout)(
				this.getTimestamp(),
				this.getLabel(level), Chars.SPACE,
				this.getTitle(level, title, message),
				this.getMessage(title, message),
				this.getExtra(extra)
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
		return this.log('debug', title, message, extra);
	}

	public info(message: string): this;
	public info(title: string, message: string): this;
	public info(title: string, message: string, extra: string): this;
	public info(title: string, message?: string, extra?: string) {
		return this.log('info', title, message, extra);
	}

	public warn(message: string): this;
	public warn(title: string, message: string): this;
	public warn(title: string, message: string, extra: string): this;
	public warn(title: string, message?: string, extra?: string) {
		return this.log('warn', title, message, extra);
	}

	public error(message: string): this;
	public error(title: string, message: string): this;
	public error(title: string, message: string, extra: string): this;
	public error(title: string, message?: string, extra?: string) {
		return this.log('error', title, message, extra);
	}

	public fatal(message: string): this;
	public fatal(title: string, message: string): this;
	public fatal(title: string, message: string, extra: string): this;
	public fatal(title: string, message?: string, extra?: string) {
		return this.log('fatal', title, message, extra);
	}

	public success(message: string): this;
	public success(title: string, message: string): this;
	public success(title: string, message: string, extra: string): this;
	public success(title: string, message?: string, extra?: string) {
		return this.log('success', title, message, extra);
	}

	public utils(message: string): this;
	public utils(title: string, message: string): this;
	public utils(title: string, message: string, extra: string): this;
	public utils(title: string, message?: string, extra?: string) {
		return this.log('utils', title, message, extra);
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
}
