/**
 * @author Josh Duff <me@JoshDuff.com> (http://joshduff.com/)
 * @see {@link https://github.com/TehShrike/deepmerge GitHub}
 * @see {@link https://www.npmjs.com/package/deepmerge npm}
 */
const merge = require('deepmerge');

function mergeNoArray(t, s) {
	return merge(t, s, { arrayMerge: ([, sauce,]) => sauce });
}

module.exports = {
	merge,
	mergeNoArray
};
