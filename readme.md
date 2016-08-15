# pixiv-app-api [![Build Status](https://travis-ci.org/akameco/pixiv-app-api.svg?branch=master)](https://travis-ci.org/akameco/pixiv-app-api)

> Promise base pixiv API client

Inspired by  [upbit/pixivpy: Pixiv API for Python](https://github.com/upbit/pixivpy).

If you want to downloading image, you can use with [pixiv-img](https://github.com/akameco/pixiv-img).

If you want using old api, you can use [pixiv](https://github.com/akameco/pixiv).

## Install

```
$ npm install --save pixiv-app-api
```


## Usage

```js
const PixivAppApi = require('pixiv-app-api');
const pixivImg = require('pixiv-img');
const pixiv = new PixivAppApi('your username', 'your password');

const word = '艦これ10000users入り';

pixiv.searchIllust(word)
	.then(json => {
		console.log(json);
		return pixiv.next();
	})
	.then(json => {
		console.log(`downloading ${json.illusts[0].title}`);
		return pixivImg(json.illusts[0].image_urls.large);
	}).then(() => {
		console.log('finish');
	});
```

See examples.


## API

### PixivAppApi(username, password)

`username`: your pixiv username<br>
`password`: your pixiv username

<hr>

#### pixiv.userDetail(userId, [query])

#### userId

Type: `number` or `string`


#### pixiv.userIllusts(userId, [query])

#### pixiv.userBookmarksIllust(userId, [query])

##### query
restrict: `public` | `private`

#### pixiv.illustFollow([query])

##### query
restrict: `public` | `private`

#### pixiv.illustComments(illustId, [query])

#### illustId

Type: `number` or `string`

#### pixiv.illustRelated(illustId, [query])

#### pixiv.illustRecommended([query])

#### illustRanking([query])

##### query
restrict: `public` | `private`<br>
date: `2016-08-15`<br>
mode: `day` | `week` | `month` | `day_male` | `day_female` | `week_original` | `week_rookie` | `day_mang` | `day_r18` | `day_male_r18` | `day_female_r18` | `week_r18` | `week_r18g`<br>

#### pixiv.trendingTagsIllust([query])

#### pixiv.searchIllust(word, [searchOptions])

##### word

Type: `string`

##### searchOptions

search_target: `partial_match_for_tags` | `exact_match_for_tags` | `title_and_caption` <br>
sort: `date_desc` | `date_asc`<br>
duration: `within_last_day` | `within_last_week` | `within_last_month`

#### pixiv.illustBookmarkDetail(illustId, [query])

#### pixiv.illustBookmarkAdd(illustId, [body])

#### pixiv.illustBookmarkDelete(illustId, [body])

#### pixiv.userBookmarkTagsIllust([query])

<hr>

#### default options
restrict: `public`<br>
mode: `day`<br>
sort: `date_desc`<br>

<hr>

#### pixiv.next()

Return next request result.

##### usage

```js
pixiv.searchIllust(word)
	.then(() => pixiv.next())
	.then(() => pixiv.next())
	.then(json => {
		console.log(json);
	});
```

#### pixiv.hasNext()

Return `true` if `pixiv.next()` is able to run.

##### usage

```js
if (pixiv.hasNext()) {
	pixiv.next().then();
}
```

#### pixiv.nextQuery()

Return next query parameter.

## Related

- [pixiv-img](https://github.com/akameco/pixiv-img) - save the image of pixiv
- [pixiv](https://github.com/akameco/pixiv) - pixiv client for public api

## License

MIT © [akameco](http://akameco.github.io)
