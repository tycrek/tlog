import { DateTimeFormatOptions, DateTime } from 'luxon';

/**
 * Require one of the keys in T
 * Thanks to ChatGPT
 */
type RequireOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
	? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
	: never;

export type TLTimestamp = RequireOne<{
	enabled: boolean;
	colour: string;
	preset?: DateTimeFormatOptions;
	format?: string;
}, 'preset' | 'format'>;

export interface TLLabel {
	enabled: boolean;
	pad: boolean;
	case: 'upper' | 'lower';
	align: 'left' | 'right';
}

export interface TLTitle {
	delim: string;
}

export interface TLExtra {
	prefix: string;
	suffix: string;
}

export interface TLComments {
	char: string;
	colour: string;
}
