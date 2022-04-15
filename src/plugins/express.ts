/**
* For Express.js (visit {@link http://expressjs.com})
*/

import { TLog, getChalk } from '../tlog';
import { tlog } from '../..';
import { EXPRESS_DEFAULTS } from '../Constants';
import { Express as E, NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

const TITLE = 'EXPRESS';
const SPACES = '  ';
const LABEL = (colour = 'green') => getChalk(colour).inverse(`[${TITLE}]`);
const code2colour = { 1: 'cyan', 2: 'green', 3: 'cyan', 4: 'yellow', 5: 'red' };

/**
 * Trim a String to a maximum length & append a suffix if it's too long
 */
function trimString(str: string, { enabled, maxLength, delim }: { enabled: boolean, maxLength: number, delim: string }) {
	return (!enabled) || str.length < maxLength ? str : str.substring(0, (maxLength - delim.length) / 2) + delim + str.substring((str.length - maxLength / 2) + 1);
}

class Express implements tlog.plugins.IPlugin {
	tlog: TLog;
	options;

	constructor(tlog: TLog, options?: tlog.plugins.express.ExpressPluginOptions) {
		this.tlog = tlog;
		this.options = options ?? EXPRESS_DEFAULTS; // todo: merge with defaults
	}

	private buildExpressLog(title: string, message: string, extra: string | null, colour: string = 'green'): string {
		return `${LABEL(colour)}${SPACES}${message ? getChalk(colour).bold(title.concat(': ')) : ''}${message || ''} ${extra ? chalk.italic(`(${extra})`) : ''}`;
	}

	/**
	 * Hosts the provided Express app on the specified port
	 */
	Host(app: E, port: number, host: string, callback?: Function) {
		// 404 Handler
		this.options.handle404 && app.use((req: Request, res: Response, _next: NextFunction) =>
			this.tlog.log(this.buildExpressLog('Not found', trimString(req.url, this.options.trim), '404', 'yellow')).callback(() => res.sendStatus(404)));

		// 500 Handler
		this.options.handle500 && app.use((err: Error, _req: Request, res: Response, _next: NextFunction) =>
			this.tlog.log(this.buildExpressLog('Response error', err.message, '500', 'red')).err(err).callback(() => res.sendStatus(500)));

		// Host the Express app
		app.listen(port, host, () =>
			this.tlog.log(this.buildExpressLog(
				'Express started',
				`Listening on ${host}:${port}`,
				`click http://127.0.0.1:${port}/`))
				.callback(callback ?? (() => void 0)));
		// todo: add methods for 4xx, 5xx, etc. (right now both this and test.js output logs)
	}

	/**
	 * Logs the request URL for every request of an Express app
	 */
	use(req: Request, res: Response, next: NextFunction) {
		const skip = (this.options.middleware.excludePaths.findIndex((path) => new RegExp(path).test(req.url)) !== -1);
		(!skip) && this.tlog.log(this.buildExpressLog(`HTTP ${req.method}`, trimString(req.url, this.options.trim), null));
		(!skip) && res.on('finish', () => this.tlog.log(this.buildExpressLog('Response', res.statusCode.toString(), null, Object(code2colour)[`${res.statusCode}`.slice(0, 1)])));
		next();
	}


	/**
	 * Logs the User Agent of the request
	 */
	UserAgent(req: Request) {
		this.tlog.log(this.buildExpressLog('User-Agent', req.header('user-agent') ?? 'unknown', null));
	}

	/**
	 * Logs a specific header of the request. Defaults to 'user-agent')
	 */
	Header(req: Request, header = 'user-agent') {
		this.tlog.log(this.buildExpressLog(`Header ${header}`, req.header(header) ?? 'unknown', null));
	}
}

export default Express;
