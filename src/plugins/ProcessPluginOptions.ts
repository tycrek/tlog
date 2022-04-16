/**
 * @see https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
 */
export type Signals = 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGBREAK' | 'SIGHUP'

/**
 * Options for the Process plugin
 */
export default class ProcessPluginOptions {
	/**
	 * @see http://nodejs.org/api/process.html#process_event_warning
	 */
	warning: boolean = true

	/**
	 * @see https://nodejs.org/api/process.html#process_event_exit
	 */
	exit: boolean = true

	/**
	 * @see https://nodejs.org/api/process.html#process_event_beforeexit
	 */
	beforeExit: boolean = true

	/**
	 * This is thrown when a Promise is rejected but no handler is registered.
	 * @see https://nodejs.org/api/process.html#process_event_unhandledrejection
	 */
	unhandledRejection: boolean = true

	/**
	 * @see https://nodejs.org/api/process.html#process_event_uncaughtexception
	 */
	uncaughtException: boolean = true

	/**
	 * Enables logging for the specified termination signals}
	 */
	signals: Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGBREAK', 'SIGHUP']
}
