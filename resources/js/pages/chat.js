whiskey.registerPage(function() {
	window.Page = Class.extend(Page, {
		participants: [],

		compose() {
			this.parent();
			// @START_WHISKEY_DEBUG
			console.info('chat-ready'); // @END_WHISKEY_DEBUG
			page.setupAjax();
			page.updateParticipantCount();
			page.displayMessages();
			// jQuery('input[name="message"]').trigger('focus');
		},

		displayMessages() {
			// @START_WHISKEY_DEBUG
			console.info('display-messages'); // @END_WHISKEY_DEBUG
			const myParticipantIdentifier = Number(jQuery('input[name="participant-id"]').val());
			const myParticipantNickname = jQuery('input[name="participant-nickname"]').val();
			const $messagePane = jQuery('#message-pane');
			page.fetchMessages(function(count, messages) {
				$messagePane.empty(); // TODO: figure out an offset index for messages instead of constantly re-rendering all of them.
				for (let message of messages) {
					let participant = message.sender;
					let sentWhenAgo = page.timeDifference(Date.now(), new Date(message.created_at));

					let $message;
					if (_.eq(myParticipantIdentifier, participant.id) && _.eq(myParticipantNickname, participant.nickname)) {
						$message = jQuery(`
							<li class="alert alert-success text-break text-wrap">
								<h6>${participant.nickname}</h6>
								<p class="alert-body">&nbsp;</p>
								<p class="m-0 text-success small when">${sentWhenAgo}</p>
							</li>`).appendTo($messagePane);
					} else {
						$message = jQuery(`
							<li class="alert alert-primary text-break text-wrap">
								<h6>${participant.nickname}</h6>
								<p class="alert-body">&nbsp;</p>
								<p class="m-0 text-primary small when">${sentWhenAgo}</p>
							</li>`).appendTo($messagePane);
					}

					$message
						.find('.alert-body')
						.text(_.unescape(message.body));

					// @START_WHISKEY_DEBUG
					console.info('render-messages', participant.nickname, message.body, messages); // @END_WHISKEY_DEBUG
				}
			});
		},

		displayParticipantList() {
			// @START_WHISKEY_DEBUG
			console.info('list-participates'); // @END_WHISKEY_DEBUG
			let participantsTemplate = jQuery('#participants-template').text(),
				$participantsModal = jQuery(participantsTemplate);
			let participants = page.participants,
				nicknames = participants.map(participant => participant.nickname);

			$participantsModal.find('.modal-body')
				.text(_.sortBy(nicknames).join(', '));
			$participantsModal.on('hidden.bs.modal', function() {
				$participantsModal.remove();
			});

			$body.append($participantsModal);
			$participantsModal.modal();
		},

		fetchMessages(callback) {
			// @START_WHISKEY_DEBUG
			console.info('fetch-messages'); // @END_WHISKEY_DEBUG
			if (typeof callback !== 'function') {
				throw new TypeError('Callback function was expected but not received.');
			}

			const myRoomIdentifier = jQuery('input[name="room-id"]').val();
			const myParticipantIdentifier = jQuery('input[name="participant-id"]').val();
			const myParticipantType = jQuery('input[name="participant-type"]').val();
			jQuery.getJSON(`/chat/conversations/${myRoomIdentifier}/messages?participant_id=${myParticipantIdentifier}&participant_type=${myParticipantType}`,
				function(response) {
					callback.apply(window, [response.total, response.data]);
				});
		},

		fetchParticipants(onSuccess) {
			// @START_WHISKEY_DEBUG
			console.info('fetch-participates'); // @END_WHISKEY_DEBUG
			if (typeof onSuccess !== 'function') {
				throw new TypeError('Callback function was expected but not received.');
			}

			const myRoomIdentifier = jQuery('input[name="room-id"]').val();
			return jQuery.getJSON(`/chat/conversations/${myRoomIdentifier}/participants`, function(response) {
				onSuccess.apply(window, [response.length, response]);
			});
		},

		registerEvents() {
			this.parent();
			// @START_WHISKEY_DEBUG
			console.info('chat-register-events'); // @END_WHISKEY_DEBUG
			jQuery('button:contains("Send")').on('click', page.sendMessage);
			jQuery('input[name="message"]').on('keyup', (onKeyUpEvent) => {
				(onKeyUpEvent.keyCode === 13) && page.sendMessage();
			});

			jQuery('a[href="#list-participants"]').on('click', function(onClickEvent) {
				onClickEvent.preventDefault();
				page.updateParticipantCount()
					.done(page.displayParticipantList);
				return false;
			});

			page.displayMessagesIntId = setInterval(page.displayMessages, 8000);
			page.updateParticipantCountIntId = setInterval(page.updateParticipantCount, 60000);
		},

		sendMessage() {
			// @START_WHISKEY_DEBUG
			console.info('send-message'); // @END_WHISKEY_DEBUG
			const $sendBtn = jQuery('button:contains("Send")');
			const $message = jQuery('input[name="message"]'),
				message = _.trimStart($message.val());
			const isSendBtnDisabled = $sendBtn.prop('disabled');
			if (isSendBtnDisabled === false && _.trimEnd(message) !== '') {
				$sendBtn.prop('disabled', true);
				const myRoomIdentifier = jQuery('input[name="room-id"]').val();
				const myParticipantIdentifier = jQuery('input[name="participant-id"]').val();
				const myParticipantType = jQuery('input[name="participant-type"]').val();
				jQuery.post(`/chat/conversations/${myRoomIdentifier}/messages`, {
					participant_id: myParticipantIdentifier,
					participant_type: myParticipantType,
					message: {
						body: _.escape(message)
					}
				}, function(response) {
					// @START_WHISKEY_DEBUG
					console.info('send-message-response', response); // @END_WHISKEY_DEBUG
					page.displayMessages();
					$message.val(null);
					$sendBtn.prop('disabled', false);
				});
			} else {
				$message.val(message);
			}
		},

		setupAjax() {
			// @START_WHISKEY_DEBUG
			console.info('setup-ajax'); // @END_WHISKEY_DEBUG
			const csrfToken = jQuery('meta[name="csrf-token"]').attr('content');
			jQuery.ajaxSetup({
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-CSRF-TOKEN': csrfToken
				}
			});
		},

		timeDifference(current, previous) {
			const msPerMinute = (60 * 1000),
				msPerHour = (msPerMinute * 60),
				msPerDay = (msPerHour * 24),
				msPerMonth = (msPerDay * 30),
				msPerYear = (msPerDay * 365);

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
		},

		updateParticipantCount() {
			// @START_WHISKEY_DEBUG
			console.info('update-participates'); // @END_WHISKEY_DEBUG
			const $listParticipants = jQuery('a[href="#list-participants"]');
			return page.fetchParticipants(function(count, participants) {
				page.participants = participants;
				$listParticipants.text(`${count} Users Online`);
			});
		}
	});

	return $window;
});
