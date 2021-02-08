whiskey.registerPage(function() {
	window.Page = Class.extend(Page, {
		compose() {
			this.parent();
			// @START_WHISKEY_DEBUG
			console.info('user-ready'); // @END_WHISKEY_DEBUG
			page.validateNickname(true);
		},

		registerEvents() {
			this.parent();
			jQuery('input[name="nickname"]')
				.on('blur', page.trimWhitespace)
				.on('change', page.validateNickname)
				.on('keyup', page.validateNickname);
			jQuery('a[href="#suggested-nickname"]').on('click', function(onClickEvent) {
				onClickEvent.preventDefault();
				return page.selectNickname(this.textContent);
			});
		},

		selectNickname(suggestedNickname) {
			jQuery('input[name="nickname"]')
				.val(suggestedNickname)
				.trigger('focus')
				.trigger('change');
		},

		trimWhitespace() {
			this.value = _.trim(this.value);
		},

		validateNickname(onCompose) {
			// @START_WHISKEY_DEBUG
			console.info('validate-nickname'); // @END_WHISKEY_DEBUG
			let $joinChatButton = jQuery('button:contains("Join Chat")');
			$joinChatButton.prop('disabled', true);
			if (onCompose !== true) {
				let $nickname = jQuery('input[name="nickname"]'),
					maxlength = $nickname.attr('maxlength'),
					minlength = $nickname.attr('minlength'),
					pattern = $nickname.attr('pattern'),
					value = _.trim($nickname.val()),
					length = value.length;
				let $size = jQuery('#sizeof-nickname');
				$size.text(`${length}/24`);

				let hasValidValue = false;
				let $errorMessage = jQuery('#interactive-error');
				if (length >= minlength && length <= maxlength) {
					$size.removeClass('text-danger')
						.addClass('text-success');
					hasValidValue = true;
				} else {
					$size.removeClass('text-success')
						.addClass('text-danger');
					if (length <= maxlength) {
						$errorMessage.text(`Has too few characters.`);
					} else {
						$errorMessage.text(`Has too many characters.`);
					}
				}

				let regex = new RegExp(pattern, 'gi');
				if (regex.test(value) === false) {
					$errorMessage.text(`Must contain only letters, numbers, dots and underscores.`);
					hasValidValue = false;

				}

				if (hasValidValue) {
					$errorMessage.text(null);
					$joinChatButton.prop('disabled', false);
				}
			}
		}
	});

	return $window;
});
