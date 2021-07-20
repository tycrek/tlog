const TLog = require('../tlog');
const logger = new TLog();

logger
	.debug('This is helpful, but not necessary')
	.info('This is good information')
	.warn('Something went wrong, but it\'s ok!')
	.blank()
	.error('Uh oh!', 'This wasn\'t supposed to happen!')
	.blank()
	.comment('Then some time later, it may have worked itself out')
	.success('It worked!')
	.blank()
	.blank()
	.comment('tlog comes with a toolkit of utility logs')
	.epoch()
	.windowSize()
	.comment('And more!');


/* logger.log(logger.chalk.black('Black text'));
logger.log(logger.chalk.red('Red text'));
logger.log(logger.chalk.green('Green text'));
logger.log(logger.chalk.yellow('Yellow text'));
logger.log(logger.chalk.blue('Blue text'));
logger.log(logger.chalk.magenta('Magenta text'));
logger.log(logger.chalk.cyan('Cyan text'));
logger.log(logger.chalk.white('White text'));
logger.log(logger.chalk.gray('Gray text'));
logger.log(logger.chalk.grey('Grey text'));
logger.log(logger.chalk.blackBright('BlackBright text'));
logger.log(logger.chalk.redBright('RedBright text'));
logger.log(logger.chalk.greenBright('GreenBright text'));
logger.log(logger.chalk.yellowBright('YellowBright text'));
logger.log(logger.chalk.blueBright('BlueBright text'));
logger.log(logger.chalk.magentaBright('MagentaBright text'));
logger.log(logger.chalk.cyanBright('CyanBright text'));
logger.log(logger.chalk.whiteBright('WhiteBright text'));

logger.log(logger.chalk.inverse.black('Black text'));
logger.log(logger.chalk.inverse.red('Red text'));
logger.log(logger.chalk.inverse.green('Green text'));
logger.log(logger.chalk.inverse.yellow('Yellow text'));
logger.log(logger.chalk.inverse.blue('Blue text'));
logger.log(logger.chalk.inverse.magenta('Magenta text'));
logger.log(logger.chalk.inverse.cyan('Cyan text'));
logger.log(logger.chalk.inverse.white('White text'));
logger.log(logger.chalk.inverse.gray('Gray text'));
logger.log(logger.chalk.inverse.grey('Grey text'));
logger.log(logger.chalk.inverse.blackBright('BlackBright text'));
logger.log(logger.chalk.inverse.redBright('RedBright text'));
logger.log(logger.chalk.inverse.greenBright('GreenBright text'));
logger.log(logger.chalk.inverse.yellowBright('YellowBright text'));
logger.log(logger.chalk.inverse.blueBright('BlueBright text'));
logger.log(logger.chalk.inverse.magentaBright('MagentaBright text'));
logger.log(logger.chalk.inverse.cyanBright('CyanBright text'));
logger.log(logger.chalk.inverse.whiteBright('WhiteBright text'));
//logger.log(logger.chalk.grayBright('GrayBright text'));
//logger.log(logger.chalk.greyBright('GreyBright text'));
logger.log(logger.chalk.bgBlack('Black background'));
logger.log(logger.chalk.bgRed('Red background'));
logger.log(logger.chalk.bgGreen('Green background'));
logger.log(logger.chalk.bgYellow('Yellow background'));
logger.log(logger.chalk.bgBlue('Blue background'));
logger.log(logger.chalk.bgMagenta('Magenta background'));
logger.log(logger.chalk.bgCyan('Cyan background'));
logger.log(logger.chalk.bgWhite('White background'));
logger.log(logger.chalk.bgGray('Gray background'));
logger.log(logger.chalk.bgGrey('Grey background'));
logger.log(logger.chalk.bgBlackBright('Bright black background'));
logger.log(logger.chalk.bgRedBright('Bright red background'));
logger.log(logger.chalk.bgGreenBright('Bright green background'));
logger.log(logger.chalk.bgYellowBright('Bright yellow background'));
logger.log(logger.chalk.bgBlueBright('Bright blue background'));
logger.log(logger.chalk.bgMagentaBright('Bright magenta background'));
logger.log(logger.chalk.bgCyanBright('Bright cyan background'));
logger.log(logger.chalk.bgWhiteBright('Bright white background'));
//logger.log(logger.chalk.bgGrayBright('Bright gray background'));
//logger.log(logger.chalk.bgGreyBright('Bright grey background')); */
/*
logger.chalk.black;
logger.chalk.red;
logger.chalk.green;
logger.chalk.yellow;
logger.chalk.blue;
logger.chalk.magenta;
logger.chalk.cyan;
logger.chalk.white;
logger.chalk.gray;
logger.chalk.grey;
logger.chalk.blackBright
logger.chalk.redBright
logger.chalk.greenBright
logger.chalk.yellowBright
logger.chalk.blueBright
logger.chalk.magentaBright
logger.chalk.cyanBright
logger.chalk.whiteBright
logger.chalk.grayBright
logger.chalk.greyBright
logger.chalk.bgBlack;
logger.chalk.bgRed;
logger.chalk.bgGreen;
logger.chalk.bgYellow;
logger.chalk.bgBlue;
logger.chalk.bgMagenta;
logger.chalk.bgCyan;
logger.chalk.bgWhite;
logger.chalk.bgGray;
logger.chalk.bgGrey;
logger.chalk.bgBlackBright;
logger.chalk.bgRedBright;
logger.chalk.bgGreenBright;
logger.chalk.bgYellowBright;
logger.chalk.bgBlueBright;
logger.chalk.bgMagentaBright;
logger.chalk.bgCyanBright;
logger.chalk.bgWhiteBright;
logger.chalk.bgGrayBright;
logger.chalk.bgGreyBright;
*/