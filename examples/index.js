/* eslint no-console:0 */
'use strict'
const Pixiv = require('..')

async function main() {
  const { NAME, PASSWORD } = process.env
  const pixiv = new Pixiv(NAME, PASSWORD)
  const userId = 471355
  const illustId = 57907953
  const word = '艦これ10000users入り'
  const res = await pixiv.login()
  console.log(res)
  console.log(await pixiv.userIllusts(userId))
  await pixiv.userIllusts(userId).then(console.log)
  await pixiv.userBookmarksIllust(userId).then(console.log)
  await pixiv.userBookmarksIllust(userId).then(console.log)
  await pixiv.illustFollow().then(console.log)
  await pixiv.illustComments(illustId).then(console.log)
  await pixiv.trendingTagsIllust().then(console.log)
  await pixiv.userDetail(userId).then(console.log)
  await pixiv.illustDetail(illustId).then(console.log)

  {
    const res1 = await pixiv.searchIllust(word)
    console.log(res1)
    const res2 = await pixiv.next()
    console.log(res2)
  }

  await pixiv.illustBookmarkDetail(illustId).then(console.log)

  await pixiv.illustBookmarkDelete(illustId)
  console.log('delete bookmak')
  await pixiv.illustBookmarkAdd(illustId)
  console.log('add bookmak')

  await pixiv.userBookmarkTagsIllust({ restrict: 'public' })
}

try {
  main()
} catch (error) {
  console.log(error)
}
