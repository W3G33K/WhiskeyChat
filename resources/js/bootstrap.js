import jQuery from 'jquery';
import underscore from 'lodash';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';
import Class from './ext-lib/inheritance-2.7';
import Page from './page';

let body = document.body;

window.whiskey = {};
whiskey.registerPage = (function(pRegisterInvokable) {
	if (typeof pRegisterInvokable !== 'function') {
		throw new TypeError('Invokable page registree was expected but not received.');
	}

	let $window = pRegisterInvokable.apply(window);
	$window.trigger('whiskey.kickoff');
});

try {
	window.Class = Class;
	window.$ = window.jQuery = jQuery;
	window._ = underscore;
	window.Popper = Popper;
	window.bootstrap = bootstrap;
	console.log( bootstrap );

	// Globalize commonly used elements for convenience;
	window.$body = jQuery(body);
	window.$document = jQuery(document);
	window.$htmlbody = jQuery('html, body');
	window.$window = jQuery(window);
	window.Page = Page.getClass();
} catch (e) {
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
	wrapperStyles.padding = '8px 8px 0';
	wrapperStyles.textAlign = 'center';

	h1Element.appendChild(errorTitle);
	paragraphElement.appendChild(errorMessage);
	wrapperElement.appendChild(h1Element);
	wrapperElement.appendChild(paragraphElement);
	wrapperElement.appendChild(imgElement);

	// @START_WHISKEY_DEBUG outputs stacktrace to document
	let errorElement = document.createElement('pre'),
		errorStack = document.createTextNode(
			`Debug Stacktrace\n${e.stack}\nCaused by: [${e.name} error] ${e.message}\n`);
	let errorStyles = errorElement.style;
	errorStyles.backgroundColor = '#161616';
	errorStyles.color = '#fa0000';
	errorStyles.fontWeight = 'bolder';
	errorStyles.marginTop = '12px';
	errorStyles.padding = '8px';
	errorStyles.textAlign = 'left';
	errorElement.appendChild(errorStack);
	wrapperElement.appendChild(errorElement); // @END_WHISKEY_DEBUG

	body.appendChild(wrapperElement);

	// TODO: Submit error logs to server.

	let classAttribute = body.getAttribute('class'),
		classList = classAttribute.split(' ');
	let invisiClassIndex = classList.lastIndexOf('invisible');
	classList.splice(invisiClassIndex, 1);
	body.setAttribute('class', classList.join(' '));
	console.error(`WhiskeyChat failed to initialized during bootstrapping process: ${e.message}`);

	throw e;
}
