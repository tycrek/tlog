import { TLog } from '../';

const log = new TLog('debug');

log.debug('Simple debug message')
	.info('Simple info message')
	.warn('Simple warn message')
	.error('Simple error message')
	.fatal('Simple fatal message')
	.success('Simple success message')
	.utils('Simple utils message');

log.debug('Debug message with a', 'Title')
	.info('Info message with a', 'Title')
	.warn('Warn message with a', 'Title')
	.error('Error message with a', 'Title')
	.fatal('Fatal message with a', 'Title')
	.success('Success message with a', 'Title')
	.utils('Utils message with a', 'Title');

log.debug('Debug message with a', 'Title', 'and extra')
	.info('Info message with a', 'Title', 'and extra')
	.warn('Warn message with a', 'Title', 'and extra')
	.error('Error message with a', 'Title', 'and extra')
	.fatal('Fatal message with a', 'Title', 'and extra')
	.success('Success message with a', 'Title', 'and extra')
	.utils('Utils message with a', 'Title', 'and extra');

log.comment('This is a test comment.', 'Here is another argument.')
	.basic('This is a test basic.', 'Here is another argument.')
	.blank()
	.comment('That was a blank line.');

const log2 = new TLog('debug')
	.setTimestamp({ enabled: false })
	.setComments({ char: '👉' })
	.setLabel({ case: 'lower', pad: false });

log2.debug('Simple debug message')
	.info('Simple info message')
	.warn('Warning', 'TLog is super cool again')
	.comment('But don\'t tell anyone.')
	.callback(() => console.log('This is a regular console.log in a callback.'));

/* Express test */
//import express from 'express';
const express = require('express');
const app = express();

const logExpress = new TLog('debug')

app.use(logExpress.express());
app.get('/', (req, res) => res.header('Content-Type', 'text/html').send('<h1>Hello World!</h1>'));
app.listen(3000, () => logExpress.info('Example app listening on port 3000! Click http://localhost:3000/ to view.'));
