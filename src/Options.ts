import { DateTimeFormatOptions } from 'luxon';

/**
 * Require one of the keys in T
 * Thanks to ChatGPT
 */
type RequireOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
	? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
	: never;

/**
 * Options for timestamps
 */
export type TLTimestamp = RequireOne<{

	/**
	 * Enable/disable timestamps
	 */
	enabled: boolean;

	/**
	 * Colour of timestamps
	 */
	colour: string;

	/**
	 * Luxon preset for timestamps (from `DateTime`)
	 * 
	 * @see [Luxon presets](https://moment.github.io/luxon/docs/manual/formatting.html#presets)
	 */
	preset?: DateTimeFormatOptions;

	/**
	 * Custom Luxon format for timestamps
	 * @see [Luxon formats](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens)
	 */
	format?: string;
}, 'preset' | 'format'>;

/**
 * Options for labels
 */
export interface TLLabel {

	/**
	 * Enable/disable labels
	 */
	enabled: boolean;

	/**
	 * Enable/disable padding around labels
	 */
	pad: boolean;

	/**
	 * Casing of labels
	 */
	case: 'upper' | 'lower';

	/**
	 * Alignment of labels
	 */
	align: 'left' | 'right';
}

/**
 * Options for titles
 */
export interface TLTitle {

	/**
	 * Delimiter between title and message
	 */
	delim: string;
}

/**
 * Options for extras
 */
export interface TLExtra {

	/**
	 * Prefix for extras
	 */
	prefix: string;

	/**
	 * Suffix for extras
	 */
	suffix: string;
}

/**
 * Options for comments
 */
export interface TLComments {

	/**
	 * Character for comments
	 */
	char: string;

	/**
	 * Colour of comments
	 */
	colour: string;
}
