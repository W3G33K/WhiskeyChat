const whiskey = Object.assign({}, window.whiskey);
const Page = Class.create({
	initialize() {
		// @START_WHISKEY_DEBUG
		whiskey.debug('page-initialize', console.info); // @END_WHISKEY_DEBUG
	},

	ready() {
		// @START_WHISKEY_DEBUG
		whiskey.debug('page-ready', console.info); // @END_WHISKEY_DEBUG
		$body.addClass(['bg-dark', 'overflow-hidden']);
		setInterval(function() {
			document.title = ((document.title.startsWith('🟢 ')) ? document.title.substr(3) : ('🟢 ' + document.title));
		}, 1000);
	},
});

module.exports = Page;
