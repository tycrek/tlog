import { TLog } from '../';

const what = 'what';

const tlog = new TLog('info');
tlog.debug('debug', what);
tlog.info('info', what);
tlog.warn('warn', what);
tlog.error('error', what);
tlog.fatal('fatal', what);
