const deannotate = (source) =>
	source.replace(/\/[\/*]\s?@start_whiskey_debug[\s\S]+?@end_whiskey_debug.*/gi, '');

function WhiskeyDebugStripper(source) {
	this.callback(null, deannotate(source));
}

module.exports = WhiskeyDebugStripper;
