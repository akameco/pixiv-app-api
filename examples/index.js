'use strict';
const Pixiv = require('../');

const {USERNAME, PASSWORD} = process.env;
const pixiv = new Pixiv(USERNAME, PASSWORD);
const userId = 471355;
const illustId = 57907953;
const word = '艦これ10000users入り';

pixiv.userIllusts(userId).then(console.log);
pixiv.userBookmarksIllust(userId).then(console.log);
pixiv.userBookmarksIllust(userId).then(console.log);
pixiv.illustFollow().then(console.log);
pixiv.illustComments(illustId).then(console.log);
pixiv.trendingTagsIllust().then(console.log);
pixiv.userDetail(userId).then(console.log);
pixiv.illustDetail(illustId).then(console.log);

pixiv.searchIllust(word)
	.then(res => {
		console.log(res);
	})
	.then(() => pixiv.next())
	.then(console.log);

pixiv.illustBookmarkDetail(illustId).then(console.log);

pixiv.illustBookmarkDelete(illustId).then(() => {
	console.log('delete bookmak');
}).then(() => pixiv.illustBookmarkAdd(illustId)).then(() => {
	console.log('add bookmak');
});

pixiv.userBookmarkTagsIllust({restrict: 'public'}).then(console.log);
