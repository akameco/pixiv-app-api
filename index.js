'use strict';
const url = require('url');
const PixivAuthGot = require('pixiv-auth-got');

const ENDPOINT = 'https://app-api.pixiv.net/';
const filter = 'for_ios';

class PixivAppApi {
	constructor(username, password) {
		this.pixivAuthGot = new PixivAuthGot(username, password);
	}

	got(path, opts) {
		const apiUrl = /https/.test(path) ? path : url.resolve(ENDPOINT, path);

		return this.pixivAuthGot.got(apiUrl, opts).then(res => {
			const body = res.body;
			this.nextUrl = (body && body.next_url) ? body.next_url : null;
			return body;
		});
	}

	next() {
		return this.got(this.nextUrl);
	}

	hasNext() {
		return Boolean(this.nextUrl);
	}

	nextQuery() {
		return url.parse(this.nextUrl, true).query;
	}

	userDetail(id, query) {
		if (!id) {
			return Promise.reject(new Error('user_id required'));
		}

		query = Object.assign({
			user_id: id,
			filter
		}, query);
		return this.got('v1/user/detail', {query});
	}

	userIllusts(id, query) {
		if (!id) {
			return Promise.reject(new Error('user_id required'));
		}

		query = Object.assign({
			user_id: id,
			type: 'illust',
			filter
		});
		return this.got('v1/user/illusts', {query});
	}

	userBookmarksIllust(id, query) {
		if (!id) {
			return Promise.reject(new Error('user_id required'));
		}

		query = Object.assign({
			user_id: id,
			restrict: 'public',
			filter
		}, query);
		return this.got('v1/user/bookmarks/illust', {query});
	}

	illustDetail(id, query) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		query = Object.assign({
			illust_id: id,
			filter
		}, query);
		return this.got('v1/illust/detail', {query});
	}

	illustFollow(query) {
		query = Object.assign({
			restrict: 'public'
		}, query);
		return this.got('v2/illust/follow', {query});
	}

	illustComments(id, query) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		query = Object.assign({
			illust_id: id,
			include_total_comments: 'true'
		}, query);
		return this.got('v1/illust/comments', {query});
	}

	illustRelated(id, query) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		query = Object.assign({
			illust_id: id,
			filter
		}, query);
		return this.got('v1/illust/related', {query});
	}

	illustRecommended(query) {
		query = Object.assign({
			content_type: 'illust',
			include_ranking_label: 'true',
			filter
		}, query);
		return this.got('v1/illust/recommended', {query});
	}

	illustRanking(query) {
		query = Object.assign({
			mode: 'day',
			filter
		}, query);
		return this.got('v1/illust/ranking', {query});
	}

	trendingTagsIllust(query) {
		query = Object.assign({
			filter
		}, query);
		return this.got('v1/trending-tags/illust', {query});
	}

	searchIllust(word, query) {
		if (!word) {
			return Promise.reject(new Error('word required'));
		}

		query = Object.assign({
			word,
			search_target: 'partial_match_for_tags',
			sort: 'date_desc',
			filter
		}, query);
		return this.got('v1/search/illust', {query});
	}

	illustBookmarkDetail(id, query) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		query = Object.assign({
			illust_id: id
		}, query);
		return this.got('v2/illust/bookmark/detail', {query});
	}

	illustBookmarkAdd(id, body) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		body = Object.assign({
			illust_id: id,
			restrict: 'public'
		}, body);
		return this.got('v1/illust/bookmark/add', {body, method: 'post'});
	}

	illustBookmarkDelete(id, body) {
		if (!id) {
			return Promise.reject(new Error('illust_id required'));
		}

		body = Object.assign({
			illust_id: id
		}, body);
		return this.got('v1/illust/bookmark/delete', {body, method: 'post'});
	}

	userBookmarkTagsIllust(query) {
		query = Object.assign({
			restrict: 'public'
		}, query);
		return this.got('v1/user/bookmark-tags/illust', {query});
	}
}

module.exports = PixivAppApi;
