$window.on('whiskey.kickoff', function() {
	window.page = new Page();
	$document.ready(page.compose);
	$window.on('beforeunload', page.dispose);
	$window.on('unload', page.dispose);
});
