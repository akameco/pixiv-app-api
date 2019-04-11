const isEqual = require('lodash.isequal')
const isPlainObj = require('is-plain-obj')
const PixivAppApi = require('.')

const userId = 471355
const illustId = 57907953

jest.setTimeout(10000)

function setup() {
  const { NAME, PASSWORD } = process.env
  return new PixivAppApi(NAME, PASSWORD)
}

const pixiv = setup()
let auth = null

async function setAuth() {
  auth = await pixiv.login()
}

// リクエストを送りまくると制限されるので1度だけlogin
beforeAll(() => {
  return setAuth()
})

test('expose a constructor', () => {
  expect(typeof PixivAppApi === 'function').toBe(true)
})

test('auth', () => {
  const json = pixiv.authInfo()
  expect(isPlainObj(json)).toBe(true)
})

test('userDetail', async () => {
  expect.assertions(1)
  const json = await pixiv.userDetail(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userIllusts', async () => {
  expect.assertions(1)
  const json = await pixiv.userIllusts(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust', async () => {
  expect.assertions(1)
  const json = await pixiv.userBookmarksIllust(auth.user.id)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust private', async () => {
  expect.assertions(1)
  const json = await pixiv.userBookmarksIllust(auth.user.id, {
    restrict: 'private'
  })
  expect(isPlainObj(json)).toBe(true)
})

test('illustDetail', async () => {
  expect.assertions(1)
  const json = await pixiv.illustDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustFollow', async () => {
  expect.assertions(1)
  const json = await pixiv.illustFollow(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustComments', async () => {
  expect.assertions(1)
  const json = await pixiv.illustComments(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRelated', async () => {
  expect.assertions(1)
  const json = await pixiv.illustRelated(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRecommended', async () => {
  expect.assertions(1)
  const json = await pixiv.illustRecommended()
  expect(isPlainObj(json)).toBe(true)
})

test('illustRanking', async () => {
  expect.assertions(1)
  const json = await pixiv.illustRanking()
  expect(isPlainObj(json)).toBe(true)
})

test('trendingTagsIllust', async () => {
  expect.assertions(1)
  const json = await pixiv.trendingTagsIllust()
  expect(isPlainObj(json)).toBe(true)
})

test('searchIllust', async () => {
  expect.assertions(1)
  const json = await pixiv.searchIllust('レム')
  expect(isPlainObj(json)).toBe(true)
})

test('illustBookmarkDetail', async () => {
  expect.assertions(1)
  const json = await pixiv.illustBookmarkDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('error if params missing', async () => {
  expect.assertions(5)
  await expect(pixiv.userBookmarksIllust()).rejects.toThrow('user_id required')
  await expect(pixiv.illustComments()).rejects.toThrow('illust_id required')
  await expect(pixiv.illustRelated()).rejects.toThrow('illust_id required')
  await expect(pixiv.searchIllust()).rejects.toThrow('word required')
  await expect(pixiv.illustBookmarkDetail()).rejects.toThrow(
    'illust_id required'
  )
})

test('decamelize params', async () => {
  expect.assertions(1)
  const json1 = await pixiv.userIllusts(userId)
  const json2 = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect(isEqual(json1, json2)).toBe(false)
})

test('camelcaseKeys', async () => {
  expect.assertions(1)
  const json = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'nextUrl')).toBe(true)
})

test('not camelcaseKeys', async () => {
  expect.assertions(1)
  const json = await pixiv.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'next_url')).toBe(false)
})
