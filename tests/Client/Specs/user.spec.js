import User from '../../../resources/js/pages/user';

import {expect} from 'chai';
import sinon from 'sinon';

import jQuery from 'jquery';
import lodash from 'lodash';


describe('UserPage', () => {
	let sandbox = sinon.createSandbox();

	afterEach('cleanup and reset', () => {
		sandbox.restore();

		let documentBody = document.body;
		documentBody.removeAttribute('class');
		while (documentBody.firstChild) {
			documentBody.removeChild(documentBody.lastChild);
		}
	});

	it('says upon initialization of the user page a `welcome` class will be added to document body', () => {
		let documentBody = document.body,
			classList = documentBody.classList;
		expect([...classList]).length(0);

		new User(jQuery, lodash);

		expect([...classList]).length(1);
		expect([...classList]).to.contain('welcome');
	});

	it('says when page is composed `invisible` class will be removed from document body', () => {
		let documentBody = document.body,
			classList = documentBody.classList;
		classList.add('invisible');

		let user = new User(jQuery, lodash);
		user.compose();

		expect([...classList]).length(1);
		expect([...classList]).to.contain('welcome');
	});

	it('says when a suggested-nickname is clicked suggested-nickname should be populated into user nickname input', () => {
		let targetObject = {
			textContent: 'todd.howard2077'
		};

		let testClickEvent = new MouseEvent('click');
		sandbox.stub(testClickEvent, 'target').get(() => targetObject);
		// let getterSpy = sinon.spy(testClickEvent, 'target', ['get']);
		let preventDefaultSpy = sandbox.spy(testClickEvent, 'preventDefault'),
			jqTriggerSpy = sandbox.spy(jQuery.fn, 'trigger'),
			jqValueSpy = sandbox.spy(jQuery.fn, 'val');

		let user = new User(jQuery, lodash);
		user.selectNickname(testClickEvent);

		// expect(getterSpy.get.calledOnce).to.equal(true);
		expect(preventDefaultSpy.calledOnce).to.equal(true);
		expect(jqValueSpy.calledOnceWith('todd.howard2077')).to.equal(true);
		expect(jqTriggerSpy.firstCall.calledWith('focus')).to.equal(true);
		expect(jqTriggerSpy.secondCall.calledWith('change')).to.equal(true);
	});

	it('says should trim whitespace from a given value object', () => {
		let values = [
			'jenna.foxx', ' jenna.foxx', 'jenna.foxx ', ' jenna.foxx ',
			'   jenna.foxx', 'jenna.foxx    ', '   jenna.foxx    '
		];

		for (let value of values) {
			let testBlurEvent = new Event('blur'),
				targetObject = {value};
			sandbox.stub(testBlurEvent, 'target').get(() => targetObject);

			let user = new User(jQuery, lodash);
			user.trimWhitespace(testBlurEvent);
			// user.trimWhitespace
			// .call(htmlInputObject);

			expect(targetObject.value).to.equal('jenna.foxx');
		}
	});

	it('says upon initialization of the user page the Join Chat button is disabled by default', () => {
		let jqPropSpy = sandbox.spy(jQuery.fn, 'prop');
		new User(jQuery, lodash);
		expect(jqPropSpy.calledOnceWith('disabled', true)).to.equal(true);
	});

	it('says Join Chat button should be re-enabled when user nickname is within validation criteria', () => {
		let jqAddClassSpy = sandbox.spy(jQuery.fn, 'addClass'),
			jqPropSpy = sandbox.spy(jQuery.fn, 'prop'),
			jqRemoveClassSpy = sandbox.spy(jQuery.fn, 'removeClass'),
			jqTextSpy = sandbox.spy(jQuery.fn, 'text');
		let jqAttrStub = sandbox.stub(jQuery.fn, 'attr'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');

		jqAttrStub.withArgs('maxlength').returns(24);
		jqAttrStub.withArgs('minlength').returns(3);
		jqAttrStub.withArgs('pattern').returns(/^[\w._]+$/);
		jqValueStub.returns('Ellament');

		let user = new User(jQuery, lodash);
		user.validateNickname();

		expect(jqPropSpy.calledWithExactly('disabled', true), 'disable Join Chat button by default').to.equal(true);
		expect(jqTextSpy.calledWithExactly('8/24'), 'ensures input value of nickname is within maxlength').to.equal(true);
		expect(jqTextSpy.calledWithExactly(null), 'remove the error text (if present)').to.equal(true);
		expect(jqRemoveClassSpy.calledWithExactly('text-danger'), 'remove danger class from widget (if present)').to.equal(true);
		expect(jqAddClassSpy.calledWithExactly('text-success'), 'adds success class to widget').to.equal(true);
		expect(jqPropSpy.calledWithExactly('disabled', false), 're-enable the Join Chat button').to.equal(true);
	});

	it('says Join Chat button should stay disabled when user nickname does not satisfy validation criteria by being over the character limit', () => {
		let jqAddClassSpy = sandbox.spy(jQuery.fn, 'addClass'),
			jqPropSpy = sandbox.spy(jQuery.fn, 'prop'),
			jqRemoveClassSpy = sandbox.spy(jQuery.fn, 'removeClass'),
			jqTextSpy = sandbox.spy(jQuery.fn, 'text');
		let jqAttrStub = sandbox.stub(jQuery.fn, 'attr'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');

		jqAttrStub.withArgs('maxlength').returns(24);
		jqAttrStub.withArgs('minlength').returns(3);
		jqAttrStub.withArgs('pattern').returns(/^[\w._]+$/);
		jqValueStub.returns('It runs "surprisingly well"!');

		let user = new User(jQuery, lodash);
		user.validateNickname();

		expect(jqPropSpy.calledWithExactly('disabled', true), 'disable Join Chat button by default').to.equal(true);
		expect(jqTextSpy.calledWithExactly('28/24'), 'ensure input value of nickname is within maxlength').to.equal(true);
		expect(jqTextSpy.calledWithExactly('Has too many characters.'), 'has the error text').to.equal(true);
		expect(jqRemoveClassSpy.calledWithExactly('text-success'), 'remove success class from widget (if present)').to.equal(true);
		expect(jqAddClassSpy.calledWithExactly('text-danger'), 'add danger class to widget').to.equal(true); // TODO: Break tests down into micro tests.
	});

	it('says Join Chat button should stay disabled when user nickname does not satisfy validation criteria by being under the character limit', () => {
		let jqAddClassSpy = sandbox.spy(jQuery.fn, 'addClass'),
			jqPropSpy = sandbox.spy(jQuery.fn, 'prop'),
			jqRemoveClassSpy = sandbox.spy(jQuery.fn, 'removeClass'),
			jqTextSpy = sandbox.spy(jQuery.fn, 'text');
		let jqAttrStub = sandbox.stub(jQuery.fn, 'attr'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');

		jqAttrStub.withArgs('maxlength').returns(24);
		jqAttrStub.withArgs('minlength').returns(15);
		jqAttrStub.withArgs('pattern').returns(/^[\w._]+$/);
		jqValueStub.returns('It just works!');

		let user = new User(jQuery, lodash);
		user.validateNickname();

		expect(jqPropSpy.calledWithExactly('disabled', true), 'disable Join Chat button by default').to.equal(true);
		expect(jqTextSpy.calledWithExactly('14/24'), 'ensure input value of nickname is within maxlength').to.equal(true);
		expect(jqTextSpy.calledWithExactly('Has too few characters.'), 'has the error text').to.equal(true);
		expect(jqRemoveClassSpy.calledWithExactly('text-success'), 'remove success class from widget (if present)').to.equal(true);
		expect(jqAddClassSpy.calledWithExactly('text-danger'), 'add danger class to widget').to.equal(true); // TODO: Break tests down into micro tests.
	});

	it('says Join Chat button should stay disabled when user nickname does not satisfy validation criteria by containing illegal characters', () => {
		let jqAddClassSpy = sandbox.spy(jQuery.fn, 'addClass'),
			jqPropSpy = sandbox.spy(jQuery.fn, 'prop'),
			jqRemoveClassSpy = sandbox.spy(jQuery.fn, 'removeClass'),
			jqTextSpy = sandbox.spy(jQuery.fn, 'text');
		let jqAttrStub = sandbox.stub(jQuery.fn, 'attr'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');

		jqAttrStub.withArgs('maxlength').returns(24);
		jqAttrStub.withArgs('minlength').returns(3);
		jqAttrStub.withArgs('pattern').returns(/^[\w._]+$/);
		jqValueStub.returns('-m0th3r6');

		let user = new User(jQuery, lodash);
		user.validateNickname();

		expect(jqPropSpy.calledWithExactly('disabled', true), 'disable Join Chat button by default').to.equal(true);
		expect(jqTextSpy.calledWithExactly('8/24'), 'ensure input value of nickname is within maxlength').to.equal(true);
		expect(jqTextSpy.calledWithExactly('Must contain only letters, numbers, dots and underscores.'), 'has the error text').to.equal(true);
		expect(jqRemoveClassSpy.calledWithExactly('text-success'), 'remove success class from widget (if present)').to.equal(true);
		expect(jqAddClassSpy.calledWithExactly('text-danger'), 'add danger class to widget').to.equal(true); // TODO: Break tests down into micro tests.
	});
});
