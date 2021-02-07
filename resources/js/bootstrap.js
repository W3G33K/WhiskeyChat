const body = document.body;
const whiskey = Object.assign({}, window.whiskey);

try {
	window.Class = require('./ext-lib/inheritance-2.7');
	window.$ = window.jQuery = require('jquery');
	window._ = require('lodash');
	window.createPopper = require('@popperjs/core');
	require('bootstrap');

	// Globalize commonly used elements for convenience;
	window.$body = jQuery(body);
	window.$document = jQuery(document);
	window.Page = require('./page');
} catch (e) {
	if (typeof window.jQuery !== "function") {
		while (body.firstChild) {
			body.removeChild(body.lastChild);
		}

		let wrapperElement = document.createElement('div'),
			h1Element = document.createElement('h1'),
			paragraphElement = document.createElement('p'),
			imgElement = document.createElement('img');
		let errorTitle = document.createTextNode('Well, this is quite embarrassing ...'),
			errorMessage = document.createTextNode(`
				Something went tits up and WhiskeyChat failed to start. Our team was notified of the issue and 
				will look into it as soon as possible. Sorry for any inconvenience this may have caused you. 
				In the meantime, please accept an awesome cat gif as our apology.
			`);

		imgElement.setAttribute('src', '//cataas.com/cat/gif');
		imgElement.setAttribute('alt', 'An awesome cat gif you say? Seems cataas.com is down.');
		imgElement.setAttribute('width', '264');

		let wrapperStyles = wrapperElement.style;
		wrapperStyles.color = '#ffffff';
		wrapperStyles.margin = '8px';
		wrapperStyles.textAlign = 'center';

		h1Element.appendChild(errorTitle);
		paragraphElement.appendChild(errorMessage);
		wrapperElement.appendChild(h1Element);
		wrapperElement.appendChild(paragraphElement);
		wrapperElement.appendChild(imgElement);

		// @START_WHISKEY_DEBUG outputs stacktrace to document
		whiskey.debug('bootstrap-error', function(target) {
			// TODO: Render debug stacktrace if env !== production.
			let errorElement = document.createElement('pre'),
				errorStack = document.createTextNode(
					`Debug Stacktrace (${target})\n${e.stack}\nCaused by: [${e.name} error] ${e.message}\n`);
			let errorStyles = errorElement.style;
			errorStyles.backgroundColor = '#161616';
			errorStyles.color = '#fa0000';
			errorStyles.fontWeight = 'bolder';
			errorStyles.marginTop = '12px';
			errorStyles.padding = '8px';
			errorStyles.textAlign = 'left';
			errorElement.appendChild(errorStack);
			wrapperElement.appendChild(errorElement);
		}); // @END_WHISKEY_DEBUG

		body.appendChild(wrapperElement);
	} else {
		let template = jQuery('#alert-template').text(),
			$modal = jQuery(template);

		$modal.find('.modal-dialog')
			.addClass('modal-dialog-scrollable');
		$modal.find('.modal-title')
			.text('Well, this is embarrassing ...');
		$modal.find('.modal-body')
			.html(`
				<p>
					Something went tits up and WhiskeyChat failed to start. Our team was notified of the issue and 
					will look into it as soon as possible. Sorry for any inconvenience this may have caused you. 
					In the meantime, please accept an awesome cat gif as our apology.
				</p>
				<img src="//cataas.com/cat/gif" alt="An awesome cat gif you say? Seems cataas.com is down." width="232"/>
			`);

		// @START_WHISKEY_DEBUG outputs stacktrace to modal
		whiskey.debug('bootstrap-error', function(target) {
			jQuery(`<pre/>`, {
				text: `Debug Stacktrace (${target})\n${e.stack}\nCaused by: [${e.name} error] ${e.message}\n`,
				css: {
					backgroundColor: '#161616',
					color: '#fa0000',
					fontWeight: 'bolder',
					marginTop: '12px',
					padding: '8px'
				}
			}).appendTo($modal.find('.modal-body'));
		}); // @END_WHISKEY_DEBUG

		$modal.find('.close')
			.prop('disabled', true);
		$modal.find('.modal-accept')
			.prop('disabled', true);

		$body.append($modal);
		$modal.modal({
			backdrop: 'static',
			keyboard: false
		});
	}

	// TODO: Submit error logs to server.

	console.error(`WhiskeyChat failed to initialized during bootstrapping process: ${e.message}`);
	throw e;
} finally {
	body.removeAttribute('class');
}
