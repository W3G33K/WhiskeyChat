if (typeof window.Page !== "undefined") {
	window.registerPage();
	$document.ready(function() {
		window.page = new Page();
		page.ready();
	});
}
