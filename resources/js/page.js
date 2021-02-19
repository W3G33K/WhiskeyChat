class Page {
	static module(PageController) {
		window[PageController.name] = PageController;
		return PageController;
	}

	constructor(jQuery = null, lodash = null) {
		this.jQuery = jQuery;
		this.lodash = lodash;
		this.initialize();
	}

	compose() {
		this.registerEvents();
		let $ = this.resolve('jQuery');
		$('body').removeClass('invisible');
	}

	dispose() {}

	initialize() {}

	registerEvents() {}

	resolve(dependency) {
		return (window[dependency] ?? this[dependency]);
	}
}

export default Page;
