/* eslint no-console:0 */
'use strict'
const co = require('co')
const pixivImg = require('pixiv-img')
const Pixiv = require('../')

const pixiv = new Pixiv()

const word = '艦これ10000users入り'

const wait = () => new Promise(resolve => setTimeout(() => resolve(), 100))

function* dl(json) {
  for (const x of json.illusts) {
    console.log(x.title)
    const orignalImgUrl = x.meta_single_page.original_image_url
    if (orignalImgUrl) {
      yield pixivImg(orignalImgUrl)
      yield wait()
    }
  }
}

co(function*() {
  const json = yield pixiv.searchIllust(word)
  yield dl(json)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!pixiv.hasNext()) {
      break
    }
    const nextJson = yield pixiv.next()
    yield dl(nextJson)
  }
  console.log('finish')
}).catch(console.error)
