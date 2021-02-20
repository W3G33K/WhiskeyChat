import Page from "../page";

class Chat extends Page {
	/**
	 * @type {Number|Timeout}
	 */
	displayMessagesIntId = 0;

	/**
	 * @type {Number|Timeout}
	 */
	displayParticipantsTypingIntId = 0;

	/**
	 * @type {{}}
	 */
	participants = null;

	/**
	 * @type {Boolean}
	 */
	participantIsTyping = false;

	/**
	 * @type {Number|Timeout}
	 */
	stopParticipantsTypingTimeoutId = 0;

	/**
	 * @type {Number|Timeout}
	 */
	updateParticipantCountIntId = 0;

	compose() {
		super.compose();
		this.updateParticipantCount();
		this.displayMessages();
		this.displayParticipantsTyping();
	}

	displayMessages() {
		this.fetchMessages((jQuery, count, messages) => {
			let lodash = this.resolve('lodash');
			let messagePane = jQuery('#message-pane');
			let participantIdentifier = Number(jQuery('input[name="participant-id"]').val());
			let participantNickname = jQuery('input[name="participant-nickname"]').val();
			messagePane.empty(); // TODO: figure out an offset index for messages instead of constantly re-rendering all of them?
			for (let index = (count - 1); index >= 0; index--) {
				let message = messages[index];
				let participant = message.sender;
				let postedAgo = this.timeDifference(Date.now(), new Date(message.created_at));
				let msg;
				if (lodash.eq(participantIdentifier, participant.id) && lodash.eq(participantNickname, participant.nickname)) {
					msg = jQuery(`
							<li class="alert alert-success text-break text-wrap">
								<h6>${participant.nickname}</h6>
								<p class="alert-body">&nbsp;</p>
								<p class="m-0 text-success small when">${postedAgo}</p>
							</li>`).appendTo(messagePane);
				} else {
					msg = jQuery(`
							<li class="alert alert-primary text-break text-wrap">
								<h6>${participant.nickname}</h6>
								<p class="alert-body">&nbsp;</p>
								<p class="m-0 text-primary small when">${postedAgo}</p>
							</li>`).appendTo(messagePane);
				}

				msg.find('.alert-body')
					.text(lodash.unescape(message.body));
			}
		});
	}

	displayParticipantList() {
		let jQuery = this.resolve('jQuery');
		let lodash = this.resolve('lodash');
		let nicknames = this.participants
			.map(participant => participant.nickname);

		let dialogTemplate = jQuery('#participants-template').text();
		let dialogModal = jQuery(dialogTemplate);
		dialogModal.find('.modal-body')
			.text(lodash.sortBy(nicknames, [nickname => nickname.toLowerCase()]).join(', '));
		jQuery('body').append(dialogModal);
		dialogModal.modal();
	}

	displayParticipantsTyping() {
		let jQuery = this.resolve('jQuery');
		let messageInput = jQuery('input[name="message"]');
		let me = jQuery('input[name="participant-nickname"]').val();
		jQuery.getJSON('/users/typing', (participants) => {
			let nicknames = participants.filter(participant => participant !== me);
			let length = nicknames.length;
			if (length >= 2) {
				messageInput.attr('placeholder', (length + ' users are currently typing ...'));
			} else if (length === 1) {
				messageInput.attr('placeholder', (nicknames[0] + ' is typing ...'));
			} else {
				messageInput.attr('placeholder', (me + ': Say hello to your fellows ...'));
			}
		});
	}

	fetchMessages(callback) {
		if (typeof callback !== 'function') {
			throw new TypeError('Callback function was expected but not received.');
		}

		let jQuery = this.resolve('jQuery');
		let myRoomIdentifier = jQuery('input[name="room-id"]').val();
		let myParticipantIdentifier = jQuery('input[name="participant-id"]').val();
		let myParticipantType = jQuery('input[name="participant-type"]').val();
		jQuery.getJSON(
			`/chat/conversations/${myRoomIdentifier}/messages?participant_id=${myParticipantIdentifier}&participant_type=${myParticipantType}&sorting=desc`,
			function(response) {
				callback.apply(this, [jQuery, Math.min(response.total, 25), response.data]);
			});
	}

	fetchParticipants(success) {
		if (typeof success !== 'function') {
			throw new TypeError('Callback function was expected but not received.');
		}

		let jQuery = this.resolve('jQuery');
		let roomIdentifier = jQuery('input[name="room-id"]').val();
		jQuery.getJSON(`/chat/conversations/${roomIdentifier}/participants`, (participants) => {
			this.participants = participants;
			success.apply(this, [jQuery, participants.length, participants]);
		});
	}

	initialize() {
		super.initialize();
		this.setupAjax();
		this.updateParticipantIsTyping(false);
	}

	postParticipantIsTyping(participantIsTyping = false) {
		let jQuery = this.resolve('jQuery');
		jQuery.post('/users/typing', {
			is_typing: +(participantIsTyping),
		});

		this.participantIsTyping = participantIsTyping;
	}

	registerEvents() {
		super.registerEvents();

		let jQuery = this.resolve('jQuery');
		jQuery('button:contains("Send")').on('click', () => this.sendMessage());
		/** IE11 oninput fix: Internet Explorer 10 & 11 fire the input event when an input field with a placeholder is
		 * focused or on page load when the placeholder contains certain characters, like Chinese. */
		jQuery('input[name="message"]')
			.on('input', (onInputEvent) => (onInputEvent.target.value !== '') && this.updateParticipantIsTyping())
			.on('keyup', (onKeyUpEvent) => (onKeyUpEvent.keyCode === 13) && this.sendMessage());
		jQuery('a[href="#list-participants"]').on('click', (clickEvent) => {
			clickEvent.preventDefault();
			this.fetchParticipants(this.displayParticipantList);
			return false;
		});

		jQuery('body').on('hidden.bs.modal', 'div.modal', function() {
			jQuery(this).remove();
		});

		this.displayMessagesIntId = setInterval(() => this.displayMessages(), 8000);
		this.displayParticipantsTypingIntId = setInterval(() => this.displayParticipantsTyping(), 1000);
		this.updateParticipantCountIntId =
			setInterval(() => this.updateParticipantCount(), 60000);
	}

	sendMessage() {
		let jQuery = this.resolve('jQuery');
		let lodash = this.resolve('lodash');
		let sendButton = jQuery('button:contains("Send")');
		let messageInput = jQuery('input[name="message"]');
		let messageValue = lodash.trimStart(messageInput.val());
		let isSendButtonDisabled = sendButton.prop('disabled');
		let message = lodash.trim(messageValue);
		if (isSendButtonDisabled === false && message !== '') {
			this.stopTyping(false);
			sendButton.prop('disabled', true);
			let myRoomIdentifier = jQuery('input[name="room-id"]').val();
			let myParticipantIdentifier = jQuery('input[name="participant-id"]').val();
			let myParticipantType = jQuery('input[name="participant-type"]').val();
			jQuery.post(`/chat/conversations/${myRoomIdentifier}/messages`, {
				participant_id: myParticipantIdentifier,
				participant_type: myParticipantType,
				message: {
					body: lodash.escape(message)
				}
			}, () => {
				this.displayMessages();
				messageInput.val(null);
				sendButton.prop('disabled', false);
			});
		} else {
			messageInput.val(messageValue);
		}
	}

	setupAjax() {
		let jQuery = this.resolve('jQuery');
		let csrfToken = jQuery('meta[name="csrf-token"]').attr('content');
		jQuery.ajaxSetup({
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-CSRF-TOKEN': csrfToken
			}
		});
	}

	startTyping() {
		if (this.participantIsTyping) {
			return;
		}

		this.postParticipantIsTyping(true);
	}

	stopTyping(override = false) {
		if (!this.participantIsTyping) {
			return;
		}

		clearTimeout(this.stopParticipantsTypingTimeoutId);
		if (!override) {
			this.postParticipantIsTyping(false);
		} else {
			this.stopParticipantsTypingTimeoutId =
				setTimeout(() => this.postParticipantIsTyping(false), 4000);
		}
	}

	timeDifference(current, previous) {
		let msPerMinute = (60 * 1000);
		let msPerHour = (msPerMinute * 60);
		let msPerDay = (msPerHour * 24);
		let msPerMonth = (msPerDay * 30);
		let msPerYear = (msPerDay * 365);
		let elapsed = (current - previous);
		if (elapsed < msPerMinute) {
			return Math.round(elapsed / 1000) + ' seconds ago';
		} else if (elapsed < msPerHour) {
			return Math.round(elapsed / msPerMinute) + ' minutes ago';
		} else if (elapsed < msPerDay) {
			return Math.round(elapsed / msPerHour) + ' hours ago';
		} else if (elapsed < msPerMonth) {
			return 'about ' + Math.round(elapsed / msPerDay) + ' days ago';
		} else if (elapsed < msPerYear) {
			return 'about ' + Math.round(elapsed / msPerMonth) + ' months ago';
		} else {
			return 'about ' + Math.round(elapsed / msPerYear) + ' years ago';
		}
	}

	updateParticipantCount() {
		this.fetchParticipants(function(jQuery, numberOf) {
			jQuery('a[href="#list-participants"]').text(`${numberOf} Users Online`);
		});
	}

	updateParticipantIsTyping(override = true) {
		if (override) {
			this.startTyping();
		}

		this.stopTyping(override);
	}
}

export default Page.module(Chat);
