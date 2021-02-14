import expect from 'expect';
import Greet from "../../../resources/js/greet";

describe('Example', () => {
	let _body = document.body;

	function _empty(element) {
		while (element.firstChild) {
			element.removeChild(element.lastChild);
		}
	}

	beforeEach('clears document.body of any rendered elements', () => _empty(_body));

	it('says Greet should render "Hello, world!" when no user is provided', () => {
		let greeter = new Greet();
		greeter.greet();
		expect(_body.textContent).toEqual('Hello, world!');
	});

	it('says Greet should render "Hello, Mari!" when Mari is provided as user', () => {
		let greeter = new Greet('Mari');
		greeter.greet();
		expect(_body.textContent).toEqual('Hello, Mari!');
	});

	it('says Greet should render "Hello, world!" when `undefined` is provided as user', () => {
		let greeter = new Greet(undefined);
		greeter.greet();
		expect(_body.textContent).toEqual('Hello, world!');
	});

	it('says Greet should render "Hello, world!" when `null` is provided as user', () => {
		let greeter = new Greet(null);
		greeter.greet();
		expect(_body.textContent).toEqual('Hello, world!');
	});

	it('says Greet should render "Hello, world!" when any non-string is provided as user', () => {
		let nonStrings = [{foo: 'bar'}, true, 123, ((a, b) => a + b), [0.32, 0.64, 0.48]];
		for (let nonString of nonStrings) {
			let greeter = new Greet(nonString);
			greeter.greet();

			expect(_body.textContent).toEqual('Hello, world!');
			_empty(_body);
		}
	});
});
