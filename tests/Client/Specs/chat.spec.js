import Chat from '../../../resources/js/pages/chat';

import {expect} from 'chai';
import sinon from 'sinon';

import jQuery from 'jquery';
import lodash from 'lodash';
import 'bootstrap/js/src/modal';

describe('ChatPage', () => {
	let sandbox = sinon.createSandbox();

	beforeEach('setup fake timers', () => {
		sandbox.useFakeTimers();
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
			nickname: 'jenna.foxx'
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
				nickname: 'jenna.foxx'
			},
			{
				id: 2,
				nickname: 'todd.howard'
			},
			{
				id: 3,
				nickname: 'Ellament'
			},
			{
				id: 4,
				nickname: 'whiskerye'
			},
			{
				id: 5,
				nickname: 'Mari_'
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
				nickname: 'jenna.foxx'
			},
			{
				id: 2,
				nickname: 'todd.howard'
			},
			{
				id: 3,
				nickname: 'Ellament'
			},
			{
				id: 4,
				nickname: 'whiskerye'
			},
			{
				id: 5,
				nickname: 'Mari_'
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
				nickname: 'jenna.foxx'
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
				nickname: 'jenna.foxx'
			},
			{
				id: 2,
				nickname: 'todd.howard'
			},
			{
				id: 3,
				nickname: 'Ellament'
			},
			{
				id: 4,
				nickname: 'whiskerye'
			},
			{
				id: 5,
				nickname: 'Mari_'
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
			data: []
		}

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
					body: 'Hello, world!'
				},
			]
		}

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
					body: 'Hello, world!'
				},
				{
					body: 'It just works!'
				},
				{
					body: 'Sixteen times the detail!'
				},
				{
					body: 'See that mountain over there? You can climb it!'
				},
				{
					body: 'That glows in the fecking dark!'
				},
			]
		}

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
					nickname: 'jenna.foxx'
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
					nickname: 'jenna.foxx'
				}
			},
			{
				body: 'It just works!',
				sender: {
					id: 2,
					nickname: 'todd.howard'
				}
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
					nickname: 'jenna.foxx'
				}
			},
			{
				body: 'It just works!',
				sender: {
					id: 2,
					nickname: 'todd.howard'
				}
			},
			{
				body: 'Wakanda Forever!!!',
				sender: {
					id: 3,
					nickname: 'black_panther'
				}
			},
			{
				body: 'Wakanda Forever!!!!!!!!!',
				sender: {
					id: 3,
					nickname: 'black_panther'
				}
			},
			{
				body: 'Sweet little lies.',
				sender: {
					id: 2,
					nickname: 'todd.howard'
				}
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
});
