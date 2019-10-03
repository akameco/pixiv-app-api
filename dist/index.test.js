"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const is_plain_obj_1 = __importDefault(require("is-plain-obj"));
const _1 = __importDefault(require("."));
const userId = 471355;
const illustId = 57907953;
const PASSWORD = process.env.PASSWORD;
const NAME = process.env.NAME;
jest.setTimeout(10000);
function setup() {
    return new _1.default(NAME, PASSWORD);
}
const pixiv = setup();
let auth = null;
async function setAuth() {
    auth = await pixiv.login();
}
// リクエストを送りまくると制限されるので1度だけlogin
beforeAll(() => {
    return setAuth();
});
test('expose a constructor', () => {
    expect(typeof _1.default === 'function').toBe(true);
});
test('auth', () => {
    const json = pixiv.authInfo();
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('userDetail', async () => {
    expect.assertions(1);
    const json = await pixiv.userDetail(userId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('userIllusts', async () => {
    expect.assertions(1);
    const json = await pixiv.userIllusts(userId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('userBookmarksIllust', async () => {
    expect.assertions(1);
    const json = await pixiv.userBookmarksIllust(auth.user.id);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('userBookmarksIllust private', async () => {
    expect.assertions(1);
    const json = await pixiv.userBookmarksIllust(auth.user.id, {
        restrict: 'private'
    });
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustDetail', async () => {
    expect.assertions(1);
    const json = await pixiv.illustDetail(illustId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustFollow', async () => {
    expect.assertions(1);
    const json = await pixiv.illustFollow(userId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustComments', async () => {
    expect.assertions(1);
    const json = await pixiv.illustComments(illustId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustRelated', async () => {
    expect.assertions(1);
    const json = await pixiv.illustRelated(illustId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustRecommended', async () => {
    expect.assertions(1);
    const json = await pixiv.illustRecommended();
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustRanking', async () => {
    expect.assertions(1);
    const json = await pixiv.illustRanking();
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('trendingTagsIllust', async () => {
    expect.assertions(1);
    const json = await pixiv.trendingTagsIllust();
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('searchIllust', async () => {
    expect.assertions(1);
    const json = await pixiv.searchIllust('レム');
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('illustBookmarkDetail', async () => {
    expect.assertions(1);
    const json = await pixiv.illustBookmarkDetail(illustId);
    expect(is_plain_obj_1.default(json)).toBe(true);
});
test('decamelize params', async () => {
    expect.assertions(1);
    const json1 = await pixiv.userIllusts(userId);
    const json2 = await pixiv.userIllusts(userId, { userId: 2957827 });
    expect(lodash_isequal_1.default(json1, json2)).toBe(false);
});
test('camelcaseKeys', async () => {
    expect.assertions(1);
    const json = await pixiv.userIllusts(userId, { userId: 2957827 });
    expect({}.hasOwnProperty.call(json, 'nextUrl')).toBe(true);
});
test('not camelcaseKeys', async () => {
    expect.assertions(1);
    const json = await pixiv.userIllusts(userId, { userId: 2957827 });
    expect({}.hasOwnProperty.call(json, 'next_url')).toBe(false);
});
test('makeIterable', async () => {
    expect.assertions(1);
    const json = await pixiv.userIllusts(userId, { userId: 2957827 });
    const iterable = pixiv.makeIterable(json);
    expect({}.hasOwnProperty.call(iterable, Symbol.asyncIterator)).toBe(true);
});
//# sourceMappingURL=index.test.js.map