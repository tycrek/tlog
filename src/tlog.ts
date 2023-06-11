import { wout, werr, Chars } from './printer';
import { Level } from './Levels';
import { TLTimestamp, TLLabel, TLTitle, TLExtra, TLComments } from './Options';
import { DateTime } from 'luxon';
import Chalk from 'chalk';

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

		// Standard options

		this.timestamp = {
			enabled: true,
			colour: 'grey',
			preset: DateTime.DATETIME_FULL_WITH_SECONDS
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

	private getChalk(colour: string): Chalk.Chalk {
		return typeof (this._chalk as any)[colour] === 'function'
			? (this._chalk as any)[colour] as Chalk.Chalk
			: this._chalk.white;
	}

	private getTimestamp(): string {
		if (!this.timestamp.enabled) return Chars.EMPTY;

		const now = DateTime.local();
		const usePreset = this.timestamp.preset !== undefined;

		return this.getChalk(this.timestamp.colour!)(usePreset
			? now.toLocaleString(this.timestamp.preset)
			: now.toFormat(this.timestamp.format!));
	}

	public debug(...args: any[]) {
		wout(this.getTimestamp(), ...args);
	}

	public info(...args: any[]) {
		wout(this.getTimestamp(), ...args);
	}

	public warn(...args: any[]) {
		werr(this.getTimestamp(), ...args);
	}

	public error(...args: any[]) {
		werr(this.getTimestamp(), ...args);
	}

	public fatal(...args: any[]) {
		werr(this.getTimestamp(), ...args);
	}
}
