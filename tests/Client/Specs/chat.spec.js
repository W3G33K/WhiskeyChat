import Chat from '../../../resources/js/pages/chat';

import {expect} from 'chai';
import sinon from 'sinon';

import jQuery from 'jquery';
import lodash from 'lodash';
import modal from 'bootstrap/js/src/modal';

describe('ChatPage', () => {
	let timer = null,
		sandbox = sinon.createSandbox();

	beforeEach('setup fake timers and localStorage', () => {
		timer = sandbox.useFakeTimers();

		let nullable = (() => null);
		global.localStorage = {
			getItem: nullable,
			setItem: nullable,
		};
	});

	afterEach('cleanup and reset', () => {
		sandbox.restore();

		let documentBody = document.body;
		documentBody.removeAttribute('class');
		while (documentBody.firstChild) {
			documentBody.removeChild(documentBody.lastChild);
		}
	});

	it('says when page is composed `invisible` class should be removed from document body', () => {
		let documentBody = document.body,
			classList = documentBody.classList;
		classList.add('invisible');

		let chat = new Chat(jQuery, lodash);
		chat.compose();

		expect([...classList]).length(0);
	});

	it('says no participants should be fetched after response yields `0` participants in room', () => {
		/** @edge-case */
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', []);

		let chat = new Chat(jQuery, lodash);
		chat.fetchParticipants(successStub);

		expect(chat.participants.length).to.equal(0);
		expect(successStub.calledOnceWithExactly(jQuery, 0, [])).to.equal(true);
	});

	it('says all participants should be fetched after response yields `1` participants in room', () => {
		let participant = {
			id: 1,
			nickname: 'jenna.foxx',
		};

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', [participant]);

		let chat = new Chat(jQuery, lodash);
		chat.fetchParticipants(successStub);

		expect(chat.participants.length).to.equal(1);
		expect(chat.participants).to.contain(participant);
		expect(successStub.calledOnceWithExactly(jQuery, 1, [participant])).to.equal(true);
	});

	it('says all participants should be fetched after response yields many participants in room', () => {
		let participants = [
			{
				id: 1,
				nickname: 'jenna.foxx',
			},
			{
				id: 2,
				nickname: 'todd.howard',
			},
			{
				id: 3,
				nickname: 'Ellament',
			},
			{
				id: 4,
				nickname: 'whiskerye',
			},
			{
				id: 5,
				nickname: 'Mari_',
			},
		];

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', participants);

		let chat = new Chat(jQuery, lodash);
		chat.fetchParticipants(successStub);

		expect(chat.participants.length).to.equal(5);
		expect(chat.participants).to.contain(participants[0]);
		expect(chat.participants).to.contain(participants[1]);
		expect(chat.participants).to.contain(participants[2]);
		expect(chat.participants).to.contain(participants[3]);
		expect(chat.participants).to.contain(participants[4]);
		expect(successStub.calledOnceWithExactly(jQuery, 5, participants)).to.equal(true);
	});

	it('says all participants should be displayed after success yields many participants in room', () => {
		let participants = [
			{
				id: 1,
				nickname: 'jenna.foxx',
			},
			{
				id: 2,
				nickname: 'todd.howard',
			},
			{
				id: 3,
				nickname: 'Ellament',
			},
			{
				id: 4,
				nickname: 'whiskerye',
			},
			{
				id: 5,
				nickname: 'Mari_',
			},
		];

		let jqTextSpy = sandbox.spy(jQuery.fn, 'text');
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax');
		jqAjaxStub.yieldsTo('success', participants);

		let chat = new Chat(jQuery, lodash);
		chat.updateParticipantCount();

		expect(jqTextSpy.calledOnceWithExactly('5 Users Online')).to.equal(true);
	});

	it('says `0` participants should be displayed when there are no participants', () => {
		/** @edge-case */
		let jqModalSpy = sandbox.spy(jQuery.fn, 'modal');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text');
		jqTextStub.onFirstCall()
			.returns('<div class="modal-body"></div>');

		let chat = new Chat(jQuery, lodash);
		chat.participants = [];
		chat.displayParticipantList();

		expect(jqTextStub.calledWith('')).to.equal(true);
		expect(jqModalSpy.calledOnce).to.equal(true);
	});

	it('says `1` participant should be displayed', () => {
		let participants = [
			{
				id: 1,
				nickname: 'jenna.foxx',
			},
		];

		let jqModalSpy = sandbox.spy(jQuery.fn, 'modal');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text');
		jqTextStub.onFirstCall()
			.returns('<div class="modal-body"></div>');

		let chat = new Chat(jQuery, lodash);
		chat.participants = participants;
		chat.displayParticipantList();

		expect(jqTextStub.calledWith('jenna.foxx')).to.equal(true);
		expect(jqModalSpy.calledOnce).to.equal(true);
	});

	it('says all participants should be displayed in a sorted order case-insensitive when there are many participants', () => {
		let participants = [
			{
				id: 1,
				nickname: 'jenna.foxx',
			},
			{
				id: 2,
				nickname: 'todd.howard',
			},
			{
				id: 3,
				nickname: 'Ellament',
			},
			{
				id: 4,
				nickname: 'whiskerye',
			},
			{
				id: 5,
				nickname: 'Mari_',
			},
		];

		let jqModalSpy = sandbox.spy(jQuery.fn, 'modal');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text');
		jqTextStub.onFirstCall()
			.returns('<div class="modal-body"></div>');

		let chat = new Chat(jQuery, lodash);
		chat.participants = participants;
		chat.displayParticipantList();

		expect(jqTextStub.calledWith('Ellament, jenna.foxx, Mari_, todd.howard, whiskerye')).to.equal(true);
		expect(jqModalSpy.calledOnce).to.equal(true);
	});

	it('says undefined message cannot be posted', () => {
		/** @edge-case */
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(true);

		let chat = new Chat(jQuery, lodash);
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(false);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(false);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(false);
		expect(jqValueStub.calledWithExactly(''), 'update message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(false);
	});

	it('says empty message cannot be posted', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(false);
		jqValueStub.onFirstCall()
			.returns('');

		let chat = new Chat(jQuery, lodash);
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(false);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(false);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(false);
		expect(jqValueStub.calledWithExactly(''), 'update message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(false);
	});

	it('says blank message cannot be posted', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(false);
		jqValueStub.onFirstCall()
			.returns('                                   ');

		let chat = new Chat(jQuery, lodash);
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(false);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(false);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(false);
		expect(jqValueStub.calledWithExactly(''), 'update message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(false);
	});

	it('says valid message should be posted', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(false);
		jqValueStub.onFirstCall()
			.returns('Hello, world!');
		jqValueStub.onSecondCall()
			.returns('1');
		jqAjaxStub.yieldsTo('success');

		let chat = new Chat(jQuery, lodash);
		let displayMessagesStub = sandbox.stub(chat, 'displayMessages');
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(true);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(true);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(true);
		expect(displayMessagesStub.calledOnce, 'post should result in a success').to.equal(true);

		// verify AJAX POST
		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/chat/conversations/1/messages');
		expect(args).to.have.property('type', 'post');
		expect(args).to.have.nested.property('data.message.body', 'Hello, world!');
	});

	it('says valid message containing whitespace at both ends should be stripped and posted', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(false);
		jqValueStub.onFirstCall()
			.returns('    Hello, world!   ');
		jqValueStub.onSecondCall()
			.returns('1');
		jqAjaxStub.yieldsTo('success');

		let chat = new Chat(jQuery, lodash);
		let displayMessagesStub = sandbox.stub(chat, 'displayMessages');
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(true);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(true);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(true);
		expect(displayMessagesStub.calledOnce, 'post should result in a success').to.equal(true);

		// verify AJAX POST
		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/chat/conversations/1/messages');
		expect(args).to.have.property('type', 'post');
		expect(args).to.have.nested.property('data.message.body', 'Hello, world!');
	});

	it('says an incredibly evil message containing XSS will be escaped upon being posted', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqPropStub = sandbox.stub(jQuery.fn, 'prop'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqPropStub.onFirstCall()
			.returns(false);
		jqValueStub.onFirstCall()
			.returns('<script type="text/javascript">eval("Something truly sinister mwahahaha!");</script>');
		jqValueStub.onSecondCall()
			.returns('1');
		jqAjaxStub.yieldsTo('success');

		let chat = new Chat(jQuery, lodash);
		let displayMessagesStub = sandbox.stub(chat, 'displayMessages');
		chat.sendMessage();

		expect(jqPropStub.calledWithExactly('disabled', true), 'disable send button').to.equal(true);
		expect(jqPropStub.calledWithExactly('disabled', false), 'enable send button').to.equal(true);
		expect(jqValueStub.calledWithExactly(null), 'empty message input').to.equal(true);
		expect(jqAjaxStub.calledOnce, 'send message').to.equal(true);
		expect(displayMessagesStub.calledOnce, 'post should result in a success').to.equal(true);

		// verify AJAX POST
		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/chat/conversations/1/messages');
		expect(args).to.have.property('type', 'post');
		expect(args).to.have.nested.property('data.message.body',
			'&lt;script type=&quot;text/javascript&quot;&gt;eval(&quot;Something truly sinister mwahahaha!&quot;);&lt;/script&gt;');
	});

	it('says messages are fetched after response yields `0` messages', () => {
		let response = {
			total: 0,
			data: [],
		};

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', response);

		let chat = new Chat(jQuery, lodash);
		chat.fetchMessages(successStub);
		expect(successStub.calledOnceWithExactly(jQuery, 0, response.data)).to.equal(true);
	});

	it('says messages are fetched after response yields `1` message', () => {
		let response = {
			total: 1,
			data: [
				{
					body: 'Hello, world!',
				},
			],
		};

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', response);

		let chat = new Chat(jQuery, lodash);
		chat.fetchMessages(successStub);
		expect(successStub.calledOnceWithExactly(jQuery, 1, response.data)).to.equal(true);
	});

	it('says messages are fetched after response yields multiple messages', () => {
		let response = {
			total: 5,
			data: [
				{
					body: 'Hello, world!',
				},
				{
					body: 'It just works!',
				},
				{
					body: 'Sixteen times the detail!',
				},
				{
					body: 'See that mountain over there? You can climb it!',
				},
				{
					body: 'That glows in the fecking dark!',
				},
			],
		};

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', response);

		let chat = new Chat(jQuery, lodash);
		chat.fetchMessages(successStub);
		expect(successStub.calledOnceWithExactly(jQuery, 5, response.data)).to.equal(true);
	});

	it('says message was posted years ago', () => {
		let timeToday = new Date(2021, 0, 1),
			timePosted = new Date(1970, 0, 1);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in years').to.equal('about 51 years ago');
	});

	it('says message was posted months ago', () => {
		let timeToday = new Date(2021, 0, 1),
			timePosted = new Date(2020, 1, 1);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in months').to.equal('about 11 months ago');
	});

	it('says message was posted days ago', () => {
		let timeToday = new Date(2021, 1, 18),
			timePosted = new Date(2021, 1, 0);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in days').to.equal('about 18 days ago');
	});

	it('says message was posted hours ago', () => {
		let timeToday = new Date(2021, 1, 18, 0, 0, 0),
			timePosted = new Date(2021, 1, 17, 22, 0, 0);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in hours').to.equal('2 hours ago');
	});

	it('says message was posted minutes ago', () => {
		let timeToday = new Date(2021, 1, 18, 0, 30, 0),
			timePosted = new Date(2021, 1, 18, 0, 0, 0);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in minutes').to.equal('30 minutes ago');
	});

	it('says message was posted seconds ago', () => {
		let timeToday = new Date(2021, 1, 18, 0, 0, 45),
			timePosted = new Date(2021, 1, 18, 0, 0, 4);
		let chat = new Chat(jQuery, lodash);
		let theDifference = chat.timeDifference(timeToday, timePosted);
		expect(theDifference, 'display difference in seconds').to.equal('41 seconds ago');
	});

	it('says no messages should be displayed after fetch response yields `0` messages', () => {
		let response = [];

		let jqInitSpy = sandbox.spy(jQuery.fn, 'init');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqValueStub.onFirstCall()
			.returns('1');
		jqValueStub.onSecondCall()
			.returns('jenna.foxx');

		let chat = new Chat(jQuery, lodash);
		sandbox.stub(chat, 'fetchMessages')
			.callsArgWith(0, jQuery, 0, response);
		chat.displayMessages();

		expect(jqTextStub.calledOnce).to.equal(false);

		// verify .message element creation
		let expectedElement = '<li class="alert alert-primary text-break text-wrap"><h6>jenna.foxx</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-primary small when">2 seconds ago</p></li>';
		let args = flatten(jqInitSpy.args).filter(arg => (typeof arg === 'string')).map(arg => arg.replace(/(>?)\s+(<)/g, '$1$2'));
		expect(args, 'should contain expected message element').not.to.contain(expectedElement);
	});

	it('says all messages should be displayed after fetch response yields `1` message', () => {
		let response = [
			{
				body: 'You all know who I am. ;)',
				sender: {
					id: 1,
					nickname: 'jenna.foxx',
				},
			},
		];

		let jqInitSpy = sandbox.spy(jQuery.fn, 'init');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqValueStub.onFirstCall()
			.returns('1');
		jqValueStub.onSecondCall()
			.returns('jenna.foxx');
		sandbox.stub(jQuery.fn, 'appendTo')
			.returnsThis();

		let chat = new Chat(jQuery, lodash);
		sandbox.stub(chat, 'fetchMessages')
			.callsArgWith(0, jQuery, 1, response);
		sandbox.stub(chat, 'timeDifference')
			.returns('fing');
		chat.displayMessages();

		expect(jqTextStub.calledOnceWithExactly('You all know who I am. ;)')).to.equal(true);

		// verify .message element creation
		let expectedElement = '<li class="alert alert-success text-break text-wrap"><h6>jenna.foxx</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">fing</p></li>';
		let notExpectedElement = '<li class="alert alert-success text-break text-wrap"><h6>todd.howard</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">fing</p></li>';
		let args = flatten(jqInitSpy.args).filter(arg => (typeof arg === 'string')).map(arg => arg.replace(/(>?)\s+(<)/g, '$1$2'));
		expect(args, 'should contain expected message element').to.contain(expectedElement);
		expect(args, 'should not contain message').not.to.contain(notExpectedElement);
	});

	it('says all messages should be displayed after fetch response yields `2` messages', () => {
		let response = [
			{
				body: 'You all know who I am. ;)',
				sender: {
					id: 1,
					nickname: 'jenna.foxx',
				},
			},
			{
				body: 'It just works!',
				sender: {
					id: 2,
					nickname: 'todd.howard',
				},
			},
		];

		let jqInitSpy = sandbox.spy(jQuery.fn, 'init');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqValueStub.onFirstCall()
			.returns('1');
		jqValueStub.onSecondCall()
			.returns('jenna.foxx');
		sandbox.stub(jQuery.fn, 'appendTo')
			.returnsThis();

		let chat = new Chat(jQuery, lodash);
		sandbox.stub(chat, 'fetchMessages')
			.callsArgWith(0, jQuery, 2, response);
		sandbox.stub(chat, 'timeDifference')
			.returns('fang');
		chat.displayMessages();

		expect(jqTextStub.calledWithExactly('You all know who I am. ;)')).to.equal(true);
		expect(jqTextStub.calledWithExactly('It just works!')).to.equal(true);

		// verify .message element creation
		let expectedElement2 = '<li class="alert alert-primary text-break text-wrap"><h6>todd.howard</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-primary small when">fang</p></li>';
		let expectedElement1 = '<li class="alert alert-success text-break text-wrap"><h6>jenna.foxx</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">fang</p></li>';
		let notExpectedElement = '<li class="alert alert-success text-break text-wrap"><h6>todd.howard</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">fang</p></li>';
		let args = flatten(jqInitSpy.args).filter(arg => (typeof arg === 'string')).map(arg => arg.replace(/(>?)\s+(<)/g, '$1$2'));
		expect(args, 'should contain expected message element (alert-primary)').to.contain(expectedElement2);
		expect(args, 'should contain expected message element (alert-success)').to.contain(expectedElement1);
		expect(args, 'should not contain message').not.to.contain(notExpectedElement);
	});

	it('says all messages should be displayed after fetch response yields multiple messages', () => {
		let response = [
			{
				body: 'You all know who I am. ;)',
				sender: {
					id: 1,
					nickname: 'jenna.foxx',
				},
			},
			{
				body: 'It just works!',
				sender: {
					id: 2,
					nickname: 'todd.howard',
				},
			},
			{
				body: 'Wakanda Forever!!!',
				sender: {
					id: 3,
					nickname: 'black_panther',
				},
			},
			{
				body: 'Wakanda Forever!!!!!!!!!',
				sender: {
					id: 3,
					nickname: 'black_panther',
				},
			},
			{
				body: 'Sweet little lies.',
				sender: {
					id: 2,
					nickname: 'todd.howard',
				},
			},
		];

		let jqInitSpy = sandbox.spy(jQuery.fn, 'init');
		let jqTextStub = sandbox.stub(jQuery.fn, 'text'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		jqValueStub.onFirstCall()
			.returns('1');
		jqValueStub.onSecondCall()
			.returns('jenna.foxx');
		sandbox.stub(jQuery.fn, 'appendTo')
			.returnsThis();

		let chat = new Chat(jQuery, lodash);
		sandbox.stub(chat, 'fetchMessages')
			.callsArgWith(0, jQuery, 5, response);
		sandbox.stub(chat, 'timeDifference')
			.returns('foom');
		chat.displayMessages();

		expect(jqTextStub.calledWithExactly('You all know who I am. ;)')).to.equal(true);
		expect(jqTextStub.calledWithExactly('It just works!')).to.equal(true);
		expect(jqTextStub.calledWithExactly('Wakanda Forever!!!')).to.equal(true);
		expect(jqTextStub.calledWithExactly('Wakanda Forever!!!!!!!!!')).to.equal(true);
		expect(jqTextStub.calledWithExactly('Sweet little lies.')).to.equal(true);

		// verify .message element creation
		let expectedElement3 = '<li class="alert alert-primary text-break text-wrap"><h6>black_panther</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-primary small when">foom</p></li>';
		let expectedElement2 = '<li class="alert alert-primary text-break text-wrap"><h6>todd.howard</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-primary small when">foom</p></li>';
		let expectedElement1 = '<li class="alert alert-success text-break text-wrap"><h6>jenna.foxx</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">foom</p></li>';
		let notExpectedElement = '<li class="alert alert-success text-break text-wrap"><h6>todd.howard</h6><p class="alert-body">&nbsp;</p><p class="m-0 text-success small when">foom</p></li>';
		let args = flatten(jqInitSpy.args).filter(arg => (typeof arg === 'string')).map(arg => arg.replace(/(>?)\s+(<)/g, '$1$2'));
		expect(args, 'should contain expected message element (alert-primary)').to.contain(expectedElement3);
		expect(args, 'should contain expected message element (alert-primary)').to.contain(expectedElement2);
		expect(args, 'should contain expected message element (alert-success)').to.contain(expectedElement1);
		expect(args, 'should not contain message').not.to.contain(notExpectedElement);
	});

	it('says despite response having paginated results only `25` messages should displayed at a time', () => {
		let response = {
			total: 30,
			data: [
				{
					body: 'Little one, it’s a simple calculus. This universe is finite, its resources, finite. If life is left unchecked, life will cease to exist. It needs correcting.',
				}, // 1
				{
					body: 'When I’m done, half of humanity will still exist. Perfectly balanced, as all things should be. I hope they remember you.',
				}, // 2
				{
					body: 'You should choose your words wisely.',
				}, // 3
				{
					body: 'I finally rest, and watch the sun rise on a grateful universe. The hardest choices require the strongest wills.',
				}, // 4
				{
					body: 'I will shred this universe down to it’s last atom and then, with the stones you’ve collected for me, create a new one. It is not what is lost but only what it is been given... a grateful universe.',
				}, // 5
				{
					body: 'In my heart, I knew you still cared. But one ever knows for sure. Reality is often disappointing.',
				}, // 6
				{
					body: 'In all my years of conquest, violence, slaughter, it was never personal. But I’ll tell you now, what I’m about to do to your stubborn, annoying little planet... I’m gonna enjoy it. Very, very much.',
				}, // 7
				{
					body: 'You’re strong. But I could snap my fingers, and you’d all cease to exist.',
				}, // 8
				{
					body: 'You’re strong. Me... You’re generous. Me... But I never taught you to lie. That’s why you’re so bad at it. Where is the Soul Stone?',
				}, // 9
				{
					body: 'Today, I lost more than you can know. But now is no time to mourn. Now is no time at all.',
				}, // 10
				{
					body: 'I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless.',
				}, // 11
				{
					body: 'I would death to imprisonment! Pride: my one fatal flaw',
				}, // 12
				{
					body: 'Dread it. Run from it. Destiny still arrives. Or should I say, I have.',
				}, // 13
				{
					body: 'Your politics bore me. Your demeanor is that of a pouty child. Return me again empty-handed... And I will bathe the stairways in your blood.',
				}, // 14
				{
					body: 'I ignored my destiny once, I can not do that again. Even for you. I’m sorry Little one.',
				}, // 15
				{
					body: 'Look. Pretty, isn’t it? Perfectly balanced. As all things should be.',
				}, // 16
				{
					body: 'Fun isn’t something one considers when balancing the universe. But this... does put a smile on my face.',
				}, // 17
				{
					body: 'You’re a great fighter, Gamora. Come. Let me help you.',
				}, // 18
				{
					body: 'Destiny waits for no man. Not even one who shall bring the universe to its knees.',
				}, // 19
				{
					body: 'At random. Dispassionate, fair. The rich and poor alike. And they called me a madman. And what I predicted, came to pass.',
				}, // 20
				{
					body: 'The work is done. I won. What I’m about to do, I’m gonna enjoy it. Very, very much!',
				}, // 21
				{
					body: 'I did not ask for your trust. I demand only your obedience.',
				}, // 22
				{
					body: 'I’m the only one who knows that. At least I’m the only who has the will to act on it. For a time, you had that same will. As you fought by my side, daughter.',
				}, // 23
				{
					body: 'Your optimism is misplaced, Asgardian.',
				}, // 24
				{
					body: 'I thought by eliminating half of life, the other half would thrive, but you have shown me... that’s impossible. As long as there are those that remember what was, there will always be those, that are unable to accept what can be. They will resist.',
				}, // 25
			],
		};

		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			successStub = sandbox.stub();
		jqAjaxStub.yieldsTo('success', response);

		let chat = new Chat(jQuery, lodash);
		chat.fetchMessages(successStub);

		expect(successStub.calledOnceWithExactly(jQuery, 25, response.data)).to.equal(true);
	});

	it('says participant typing should be posted to server', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax');
		let chat = new Chat(jQuery, lodash);

		expect(chat.participantIsTyping, 'should be false by default').to.equal(false);
		chat.postParticipantIsTyping(true);
		expect(chat.participantIsTyping, 'should now be true').to.equal(true);

		// verify AJAX POST
		expect(jqAjaxStub.calledOnce, 'post participant is typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'post');
		expect(args).to.have.nested.property('data.is_typing', 1);
	});

	it('says participant not typing should be posted to server', () => {
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax');
		let chat = new Chat(jQuery, lodash);

		expect(chat.participantIsTyping, 'should be false by default').to.equal(false);
		chat.postParticipantIsTyping(false);
		expect(chat.participantIsTyping, 'should still be false').to.equal(false);

		// verify AJAX POST
		expect(jqAjaxStub.calledOnce, 'post participant is (not) typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'post');
		expect(args).to.have.nested.property('data.is_typing', 0);
	});

	it('says display default placeholder text no participants are presently typing', () => {
		let jqAttrSpy = sandbox.spy(jQuery.fn, 'attr');
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		let chat = new Chat(jQuery, lodash);

		jqValueStub.onFirstCall()
			.returns('ed.boon');
		jqAjaxStub.yieldsTo('success', []);
		chat.displayParticipantsTyping();
		expect(jqAttrSpy.calledWithExactly('placeholder', 'ed.boon: Say hello to your fellows ...')).to.equal(true);

		// verify AJAX GET
		expect(jqAjaxStub.calledOnce, 'fetch participants who are presently typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'get');
	});

	it('says display default placeholder text you are the only participant presently typing', () => {
		let jqAttrSpy = sandbox.spy(jQuery.fn, 'attr');
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		let chat = new Chat(jQuery, lodash);

		jqValueStub.onFirstCall()
			.returns('ed.boon');
		jqAjaxStub.yieldsTo('success', ['ed.boon']);
		chat.displayParticipantsTyping();
		expect(jqAttrSpy.calledWithExactly('placeholder', 'ed.boon: Say hello to your fellows ...')).to.equal(true);

		// verify AJAX GET
		expect(jqAjaxStub.calledOnce, 'fetch participants who are presently typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'get');
	});

	it('says display `participant is typing ...` when only `1` participant is presently typing', () => {
		let jqAttrSpy = sandbox.spy(jQuery.fn, 'attr');
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		let chat = new Chat(jQuery, lodash);

		jqValueStub.onFirstCall()
			.returns('ed.boon');
		jqAjaxStub.yieldsTo('success', ['ed.boon', 'SubZero']);
		chat.displayParticipantsTyping();
		expect(jqAttrSpy.calledWithExactly('placeholder', 'SubZero is typing ... 💭')).to.equal(true);

		// verify AJAX GET
		expect(jqAjaxStub.calledOnce, 'fetch participants who are presently typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'get');
	});

	it('says display `multiple participants are typing ...` when multiple participants are presently typing', () => {
		let jqAttrSpy = sandbox.spy(jQuery.fn, 'attr');
		let jqAjaxStub = sandbox.stub(jQuery, 'ajax'),
			jqValueStub = sandbox.stub(jQuery.fn, 'val');
		let chat = new Chat(jQuery, lodash);

		jqValueStub.onFirstCall()
			.returns('ed.boon');
		jqAjaxStub.yieldsTo('success', ['cage_jCage', 'ed.boon', 'SubZero']);
		chat.displayParticipantsTyping();
		expect(jqAttrSpy.calledWithExactly('placeholder', '2 users are typing ... 💭')).to.equal(true);

		// verify AJAX GET
		expect(jqAjaxStub.calledOnce, 'fetch participants who are presently typing').to.equal(true);

		let args = flatten(jqAjaxStub.args).shift();
		expect(args).to.have.property('url', '/users/typing');
		expect(args).to.have.property('type', 'get');
	});

	it('says cannot stop typing participant from typing when participant is not typing', () => {
		let chat = new Chat(jQuery, lodash);
		expect(chat.participantIsTyping, 'should be false by default').to.equal(false);
		expect(chat.stopParticipantsTypingTimeoutId, 'should be `0` by default').to.equal(0);
		chat.stopTyping(true);
		chat.stopTyping(false);
		expect(chat.stopParticipantsTypingTimeoutId, 'should still be `0` value').to.equal(0);
		expect(chat.participantIsTyping, 'should still be false').to.equal(false);
	});

	it('says should stop typing participant from typing when participant `was` typing', () => {
		let chat = new Chat(jQuery, lodash);
		let postParticipantIsTypingStub = sandbox.stub(chat, 'postParticipantIsTyping');
		chat.participantIsTyping = true;
		chat.stopTyping();
		expect(chat.stopParticipantsTypingTimeoutId, 'should be `0` by default').to.equal(0);
		expect(postParticipantIsTypingStub.calledOnceWithExactly(false)).to.equal(true);
	});

	it('says set a timer event to stop typing participant from typing when participant `is` currently typing', () => {
		let chat = new Chat(jQuery, lodash);
		let postParticipantIsTypingStub = sandbox.stub(chat, 'postParticipantIsTyping');
		chat.participantIsTyping = true;
		chat.stopTyping(true);
		expect(chat.stopParticipantsTypingTimeoutId, 'should be a nonzero value').not.to.equal(0);
		timer.tick(4100); // tick timer forward 4.1 seconds
		expect(postParticipantIsTypingStub.calledOnceWithExactly(false)).to.equal(true);
	});
});
