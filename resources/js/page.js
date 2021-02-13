function getClass() {
	return Class.create({
		compose() {
			// @START_WHISKEY_DEBUG
			console.info('page-ready'); // @END_WHISKEY_DEBUG
			$body.removeClass('invisible');
			page.registerEvents();
		},

		dispose() {
			// @START_WHISKEY_DEBUG
			console.info('page-dispose'); // @END_WHISKEY_DEBUG
		},

		initialize() {
			// @START_WHISKEY_DEBUG
			console.info('page-initialize'); // @END_WHISKEY_DEBUG
		},

		registerEvents() {
			// @START_WHISKEY_DEBUG
			console.info('page-register-events'); // @END_WHISKEY_DEBUG
		}
	});
}

export default {getClass};
