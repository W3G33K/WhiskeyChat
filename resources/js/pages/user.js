import Page from "../page";

class User extends Page {
	initialize() {
		super.initialize();
		let jQuery = this.resolve('jQuery');
		jQuery('body').addClass('welcome');
		this.validateNickname(true);
	}

	registerEvents() {
		super.registerEvents();
		let $ = this.resolve('jQuery');
		$('input[name="nickname"]')
			.on('blur', (blurEvent => this.trimWhitespace(blurEvent)))
			.on('change', (changeEvent => this.validateNickname(changeEvent)))
			.on('keyup', (keyUpEvent => this.validateNickname(keyUpEvent)));
		$('a[href="#suggested-nickname"]').on('click', mouseEvent => this.selectNickname(mouseEvent));
	}

	selectNickname(mouseEvent) {
		mouseEvent.preventDefault();
		let $ = this.resolve('jQuery'),
			target = mouseEvent.target;
		$('input[name="nickname"]')
			.val(target.textContent)
			.trigger('focus')
			.trigger('change');
	}

	trimWhitespace(blurEvent) {
		let lodash = this.resolve('lodash');
		let target = blurEvent.target;
		target.value = lodash.trim(target.value);
	}

	validateNickname(onInitialize) {
		let jQuery = this.resolve('jQuery');
		let joinChatButton = jQuery('button:contains("Join Chat")');
		joinChatButton.prop('disabled', true);
		if (onInitialize !== true) {
			let lodash = this.resolve('lodash');
			let nickname = jQuery('input[name="nickname"]');
			let maxlength = nickname.attr('maxlength');
			let minlength = nickname.attr('minlength');
			let pattern = nickname.attr('pattern');
			let value = lodash.trim(nickname.val());
			let length = value.length;
			let sizeWidget = jQuery('#sizeof-nickname');
			sizeWidget.text(`${length}/24`);

			let errorMessage = null;
			let isLegal = true;
			let legalRegex = new RegExp(pattern, 'gi');
			if (length < minlength) {
				errorMessage = 'Has too few characters.';
				isLegal = false;
			} else if (length > maxlength) {
				errorMessage = 'Has too many characters.';
				isLegal = false;
			} else if (legalRegex.test(value) === false) {
				errorMessage = 'Must contain only letters, numbers, dots and underscores.';
				isLegal = false;
			}

			jQuery('#interactive-error').text(errorMessage);
			if (isLegal) {
				sizeWidget.removeClass('text-danger')
					.addClass('text-success');
				joinChatButton.prop('disabled', false);
			} else {
				sizeWidget.removeClass('text-success')
					.addClass('text-danger');
			}
		}
	}
}

export default Page.module(User);
