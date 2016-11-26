# pixiv-app-api [![Build Status](https://travis-ci.org/akameco/pixiv-app-api.svg?branch=master)](https://travis-ci.org/akameco/pixiv-app-api)

> Promise base pixiv API client

<img src="media/image.jpg" width=200>

Inspired by  [upbit/pixivpy: Pixiv API for Python](https://github.com/upbit/pixivpy).

## Install

```
$ npm install --save pixiv-app-api
```


## Usage

```js
const PixivAppApi = require('pixiv-app-api');
const pixivImg = require('pixiv-img');
const pixiv = new PixivAppApi('username', 'password');

pixiv.searchIllust('艦これ10000users入り')
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

#### pixiv.userDetail(userId, [params])

#### userId

Type: `number` or `string`


#### pixiv.userIllusts(userId, [params])

#### pixiv.userBookmarksIllust(userId, [params])

##### params
restrict: `public` | `private`

#### pixiv.illustDetail(illustId, [params])

#### pixiv.illustFollow([params])

##### params
restrict: `public` | `private`

#### pixiv.illustComments(illustId, [params])

#### illustId

Type: `number` or `string`

#### pixiv.illustRelated(illustId, [params])

#### pixiv.illustRecommended([params])

#### pixiv.illustRanking([params])

##### params
restrict: `public` | `private`<br>
date: `2016-08-15`<br>
mode: `day` | `week` | `month` | `day_male` | `day_female` | `week_original` | `week_rookie` | `day_mang` | `day_r18` | `day_male_r18` | `day_female_r18` | `week_r18` | `week_r18g`<br>

#### pixiv.trendingTagsIllust([params])

#### pixiv.searchIllust(word, [searchOptions])

##### word

Type: `string`

##### searchOptions

search_target: `partial_match_for_tags` | `exact_match_for_tags` | `title_and_caption` <br>
sort: `date_desc` | `date_asc`<br>
duration: `within_last_day` | `within_last_week` | `within_last_month`

#### pixiv.illustBookmarkDetail(illustId, [params])

#### pixiv.illustBookmarkAdd(illustId, [body])

#### pixiv.illustBookmarkDelete(illustId, [body])

#### pixiv.userBookmarkTagsIllust([params])

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

Return next params parameter.

## Tests

Export your pixiv username and password before running Tests.

```
$ export USERNAME=your pixiv username...
$ export PASSWORD=your pixiv password...
```

```
$ npm test
```

## Related

- [pixiv-img](https://github.com/akameco/pixiv-img) - save the image of pixiv
- [pixiv-dl](https://github.com/akameco/pixiv-dl) - pixiv image downloader
- [pixiv-dl-preview](https://github.com/akameco/pixiv-dl-preview) - electron pixiv downloader

- [pixiv](https://github.com/akameco/pixiv) - pixiv client for public api

## License

MIT © [akameco](http://akameco.github.io)
