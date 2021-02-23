import jQuery from 'jquery';
import lodash from 'lodash';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';
import Page from "./page";

try {
	window.$ = window.jQuery = jQuery;
	window._ = window.lodash = lodash;
	window.Popper = Popper;
	window.bootstrap = bootstrap;

	// Globalize commonly used elements for convenience;
	window.$document = jQuery(document);
	window.$htmlbody = jQuery('html,body');
	window.$body = jQuery('body');
	window.$window = jQuery(window);

	let pageKey = jQuery('script[data-page]').data('page');
	let PageController = (window[pageKey] ?? Page);
	if (PageController.__proto__.name === Page.name || PageController.name === Page.name) {
		let page = new PageController();
		$document.ready((documentEvent => page.compose(documentEvent)));
		$window.on('beforeunload', (windowEvent => page.dispose(windowEvent)));
		$window.on('unload', (windowEvent => page.dispose(windowEvent)));
	}
} catch (e) {
	let body = document.body;
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
