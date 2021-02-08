whiskey.registerPage(function() {
	window.Page = Class.extend(Page, {
		compose() {
			this.parent();
			// @START_WHISKEY_DEBUG
			console.info('chat-ready'); // @END_WHISKEY_DEBUG
			$body.addClass('overflow-hidden');
			page.promptNickName();
		},

		promptNickName() {
			let template = jQuery('#prompt-template').text(),
				$nickNameModal = jQuery(template);

			$nickNameModal.find('.modal-dialog')
				.addClass('modal-dialog-scrollable');
			$nickNameModal.find('.modal-title')
				.text('Enter your nickname');

			$nickNameModal.find('input[name="nickname"]').on('change', function() {
				let $nickname = $nickNameModal.find('input[name="nickname"]'),
					nickname = $nickname.val();
				if (_.isEmpty(nickname) === true || nickname.length < 3) {
					$nickNameModal.find('.close')
						.prop('disabled', true);
					$nickNameModal.find('.modal-accept')
						.prop('disabled', true);
				} else {
					$nickNameModal.find('.close')
						.prop('disabled', false);
					$nickNameModal.find('.modal-accept')
						.prop('disabled', false);
				}
			});

			$nickNameModal.find('.close')
				.prop('disabled', true);
			$nickNameModal.find('.modal-accept')
				.prop('disabled', true);

			$body.append($nickNameModal);
			$nickNameModal.modal({
				backdrop: 'static',
				keyboard: false
			});
		},
	});

	return $window;
});
