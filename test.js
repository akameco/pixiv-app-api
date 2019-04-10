const isEqual = require('lodash.isequal')
const isPlainObj = require('is-plain-obj')
const PixivAppApi = require('.')

const userId = 471355
const illustId = 57907953

function setup() {
  const { NAME, PASSWORD } = process.env
  return new PixivAppApi(NAME, PASSWORD)
}

async function login() {
  const pixiv = setup()
  const auth = await pixiv.login()
  return { auth, m: pixiv }
}

test('expose a constructor', () => {
  expect(typeof PixivAppApi === 'function').toBe(true)
})

test('auth', async () => {
  const { m } = await login()
  const json = m.authInfo()
  expect(isPlainObj(json)).toBe(true)
})

test('userDetail', async () => {
  const { m } = await login()
  const json = await m.userDetail(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userIllusts', async () => {
  const m = setup()
  const json = await m.userIllusts(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust', async () => {
  const { m, auth } = await login()
  const json = await m.userBookmarksIllust(auth.user.id)
  expect(isPlainObj(json)).toBe(true)
})

test('userBookmarksIllust private', async () => {
  const { auth, m } = await login()
  const json = await m.userBookmarksIllust(auth.user.id, {
    restrict: 'private'
  })
  expect(isPlainObj(json)).toBe(true)
})

test('illustDetail', async () => {
  const { m } = await login()
  const json = await m.illustDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustFollow', async () => {
  const { m } = await login()
  const json = await m.illustFollow(userId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustComments', async () => {
  const m = setup()
  const json = await m.illustComments(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRelated', async () => {
  const m = setup()
  const json = await m.illustRelated(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('illustRecommended', async () => {
  const { m } = await login()
  const json = await m.illustRecommended()
  expect(isPlainObj(json)).toBe(true)
})

test('illustRanking', async () => {
  const m = setup()
  const json = await m.illustRanking()
  expect(isPlainObj(json)).toBe(true)
})

test('trendingTagsIllust', async () => {
  const m = setup()
  const json = await m.trendingTagsIllust()
  expect(isPlainObj(json)).toBe(true)
})

test('searchIllust', async () => {
  const m = setup()
  const json = await m.searchIllust('レム')
  expect(isPlainObj(json)).toBe(true)
})

test('illustBookmarkDetail', async () => {
  const m = setup()
  const json = await m.illustBookmarkDetail(illustId)
  expect(isPlainObj(json)).toBe(true)
})

test('error if params missing', async () => {
  const { m } = await login()
  await expect(m.userBookmarksIllust()).rejects.toThrow('user_id required')
  await expect(m.illustComments()).rejects.toThrow('illust_id required')
  await expect(m.illustRelated()).rejects.toThrow('illust_id required')
  await expect(m.searchIllust()).rejects.toThrow('word required')
  await expect(m.illustBookmarkDetail()).rejects.toThrow('illust_id required')
})

test('decamelize params', async () => {
  const m = setup()
  const json1 = await m.userIllusts(userId)
  const json2 = await m.userIllusts(userId, { userId: 2957827 })
  expect(isEqual(json1, json2)).toBe(false)
})

test('camelcaseKeys', async () => {
  const m = setup()
  const json = await m.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'nextUrl')).toBe(true)
})

test('not camelcaseKeys', async () => {
  const m = setup()
  const json = await m.userIllusts(userId, { userId: 2957827 })
  expect({}.hasOwnProperty.call(json, 'next_url')).toBe(false)
})
