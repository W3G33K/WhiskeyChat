class Greet {
	static #_DEFAULT_USER = 'world';

	constructor(user = Greet.#_DEFAULT_USER) {
		this.user = (typeof user === 'string') ? user : Greet.#_DEFAULT_USER;
	}

	greet() {
		let user = this.user;
		let h1 = document.createElement('h1'),
			text = document.createTextNode(`Hello, ${user}!`);
		h1.appendChild(text);
		let body = document.body;
		body.appendChild(h1);
	}
}

export default Greet;
