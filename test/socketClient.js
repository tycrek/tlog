// todo: documentation

const net = require('net');
const TLog = require('../tlog');
const { SOCKET_PORT } = require('../MagicNumbers.json');

const TITLE = 'SocketClient';
const HOST = '127.0.0.1';

if (require.main === module) {
	const log = new TLog({
		timestamp: { enabled: false },
		label: { pad: false },
		level: 'debug'
	}).enable.process().info(TITLE, 'Logger ready');

	const port = parseInt(process.argv[2]) || SOCKET_PORT;
	const sock = net.createConnection(port, HOST, () => log.info(TITLE, `Connected to ${HOST}:${port}`));

	sock.on('ready', () => log.info(TITLE, 'Ready'));
	sock.on('data', (data) => log.c.log(`${decodeURI(data.toString()).trim()}`));
	sock.on('timeout', () => log.warn(TITLE, 'Timed out!', 'You may close this process now'));
	sock.on('error', (err) => log.error(TITLE, err.message));
	sock.on('close', (hadError) => log[hadError ? 'warn' : 'success'](TITLE, 'Socket closed', hadError ? 'with errors' : 'normally'));
	sock.on('end', () => log.debug(TITLE, 'Socket ended'));
}
