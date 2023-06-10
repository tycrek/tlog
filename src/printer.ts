import { Socket } from 'net';
import { EOL as eol } from 'os';

/**
 * Stream references
 */
const Stream = {
	OUT: process.stdout,
	ERR: process.stderr
}

/**
 * Static characters
 */
export const Chars = {
	EOL: eol,
	ESCAPE: '\u001b',
	EMPTY: '',
	SPACE: ' '
}

/**
 * Private stream writer
 */
function w(std: Socket, ...args: any[]) {
	std.write(args.join(Chars.EMPTY).concat(Chars.EOL));
}

/**
 * Log to stdout
 */
export function wout(...args: any[]) {
	w(Stream.OUT, ...args);
}

/**
 * Log to stderr
 */
export function werr(...args: any[]) {
	w(Stream.ERR, ...args);
}
