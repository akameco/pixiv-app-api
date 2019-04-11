const isEqual = require('lodash.isequal')
const isPlainObj = require('is-plain-obj')
const PixivAppApi = require('.')

const userId = 471355
const illustId = 57907953

function setup() {
  const { NAME, PASSWORD } = process.env
  return new PixivAppApi(NAME, PASSWORD)
}

const pixiv = setup()
let auth = null

// リクエストを送りまくると制限されるので1度だけlogin
beforeAll(async () => {
  auth = await pixiv.login()
})

test('expose a constructor', () => {
  expect(typeof PixivAppApi === 'function').toBe(true)
})

test('auth', () => {
  const json = pixiv.authInfo()
  expect(isPlainObj(json)).toBe(true)
})

test('userDetail', async () => {
  const json = await pixiv.userDetail(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userIllusts', async () => {
  const json = await pixiv.userIllusts(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust', async () => {
  const json = await pixiv.userBookmarksIllust(auth.user.id)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust private', async () => {
  const json = await pixiv.userBookmarksIllust(auth.user.id, {
    restrict: 'private'
  })
  expect(isPlainObj(json)).toBe(true)
})

test('illustDetail', async () => {
  const json = await pixiv.illustDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustFollow', async () => {
  const json = await pixiv.illustFollow(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustComments', async () => {
  const json = await pixiv.illustComments(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRelated', async () => {
  const json = await pixiv.illustRelated(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRecommended', async () => {
  const json = await pixiv.illustRecommended()
  expect(isPlainObj(json)).toBe(true)
})

test('illustRanking', async () => {
  const json = await pixiv.illustRanking()
  expect(isPlainObj(json)).toBe(true)
})

test('trendingTagsIllust', async () => {
  const json = await pixiv.trendingTagsIllust()
  expect(isPlainObj(json)).toBe(true)
})

test('searchIllust', async () => {
  const json = await pixiv.searchIllust('レム')
  expect(isPlainObj(json)).toBe(true)
})

test('illustBookmarkDetail', async () => {
  const json = await pixiv.illustBookmarkDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('error if params missing', async () => {
  await expect(pixiv.userBookmarksIllust()).rejects.toThrow('user_id required')
  await expect(pixiv.illustComments()).rejects.toThrow('illust_id required')
  await expect(pixiv.illustRelated()).rejects.toThrow('illust_id required')
  await expect(pixiv.searchIllust()).rejects.toThrow('word required')
  await expect(pixiv.illustBookmarkDetail()).rejects.toThrow(
    'illust_id required'
  )
})

test('decamelize params', async () => {
  const json1 = await pixiv.userIllusts(userId)
  const json2 = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect(isEqual(json1, json2)).toBe(false)
})

test('camelcaseKeys', async () => {
  const json = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'nextUrl')).toBe(true)
})

test('not camelcaseKeys', async () => {
  const json = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'next_url')).toBe(false)
})
