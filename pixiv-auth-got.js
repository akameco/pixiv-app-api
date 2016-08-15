'use strict';
const got = require('got');

class PixivAuthGot {
	constructor(username, password) {
		if (typeof username !== 'string') {
			return Promise.reject(new TypeError(`Expected 'username' to be a string, got ${typeof username}`));
		}

		if (typeof password !== 'string') {
			return Promise.reject(new TypeError(`Expected 'password' to be a string, got ${typeof password}`));
		}

		this.username = username;
		this.password = password;
	}

	auth() {
		if (this.headers && this.headers.Authorization) {
			return Promise.resolve();
		}

		const body = {
			client_id: 'bYGKuGVw91e0NMfPGp44euvGt59s',
			client_secret: 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK',
			get_secure_url: 1,
			grant_type: 'password',
			username: this.username,
			password: this.password
		};

		return got('https://oauth.secure.pixiv.net/auth/token', {body, json: true}).then(res => {
			const token = res.body.response.access_token;
			this.headers = {
				'Authorization': `Bearer ${token}`,
				'App-OS': 'ios',
				'App-OS-Version': '9.3.3',
				'App-Version': '6.0.9',
				'User-Agent': 'PixivIOSApp/6.0.9 (iOS 9.3.3; iPhone8,1)'
			};
		});
	}

	got(url, opts) {
		if (typeof url !== 'string') {
			return Promise.reject(new TypeError(`Expected 'url' to be a string, got ${typeof url}`));
		}

		return this.auth().then(() => {
			opts = Object.assign({}, {
				headers: this.headers,
				json: true
			}, opts);

			return got(url, opts);
		});
	}
}

module.exports = PixivAuthGot;
