import test from 'ava';
import isPlainObj from 'is-plain-obj';
import PixivAppApi from './';

const userId = 471355;
const illustId = 57907953;

test.beforeEach('new Pixiv()', t => {
	const username = process.env.USERNAME;
	const password = process.env.PASSWORD;
	t.context.m = new PixivAppApi(username, password);
});

test('expose a constructor', t => {
	t.true(typeof PixivAppApi === 'function');
});

test('userDetail', async t => {
	const json = await t.context.m.userDetail(userId);
	t.true(isPlainObj(json));
});

test('userIllusts', async t => {
	const json = await t.context.m.userIllusts(userId);
	t.true(isPlainObj(json));
});

test('userBookmarksIllust', async t => {
	const json = await t.context.m.userBookmarksIllust(userId);
	t.true(isPlainObj(json));
});

test('illustFollow', async t => {
	const json = await t.context.m.illustFollow(userId);
	t.true(isPlainObj(json));
});

test('illustComments', async t => {
	const json = await t.context.m.illustComments(illustId);
	t.true(isPlainObj(json));
});

test('illustRelated', async t => {
	const json = await t.context.m.illustRelated(illustId);
	t.true(isPlainObj(json));
});

test('illustRecommended', async t => {
	const json = await t.context.m.illustRecommended();
	t.true(isPlainObj(json));
});

test('illustRanking', async t => {
	const json = await t.context.m.illustRanking();
	t.true(isPlainObj(json));
});

test('trendingTagsIllust', async t => {
	const json = await t.context.m.trendingTagsIllust();
	t.true(isPlainObj(json));
});

test('searchIllust', async t => {
	const json = await t.context.m.searchIllust('レム');
	t.true(isPlainObj(json));
});

test('illustBookmarkDetail', async t => {
	const json = await t.context.m.illustBookmarkDetail(illustId);
	t.true(isPlainObj(json));
});

test('error if params missing', async t => {
	await t.throws(t.context.m.userDetail(), 'user_id required');
	await t.throws(t.context.m.userIllusts(), 'user_id required');
	await t.throws(t.context.m.userBookmarksIllust(), 'user_id required');

	await t.throws(t.context.m.illustComments(), /illust_id required/);
	await t.throws(t.context.m.illustRelated(), /illust_id required/);

	await t.throws(t.context.m.searchIllust(), /word required/);

	await t.throws(t.context.m.illustBookmarkDetail(), /illust_id required/);
});
