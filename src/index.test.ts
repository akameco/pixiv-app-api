import isEqual from 'lodash.isequal'
import isPlainObj from 'is-plain-obj'
import PixivAppApi from '.'

const userId = 471355
const illustId = 57907953
const PASSWORD = process.env.PASSWORD as string
const NAME = process.env.NAME as string

jest.setTimeout(10000)

function setup() {
  return new PixivAppApi(NAME, PASSWORD)
}

const pixiv = setup()
let auth: any = null

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

test('makeIterable', async () => {
  expect.assertions(1)
  const json = await pixiv.userIllusts(userId, { userId: 2957827 })
  const iterable = pixiv.makeIterable(json)
  expect({}.hasOwnProperty.call(iterable, Symbol.asyncIterator)).toBe(true)
})
