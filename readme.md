# pixiv-app-api [![Build Status](https://travis-ci.org/akameco/pixiv-app-api.svg?branch=master)](https://travis-ci.org/akameco/pixiv-app-api)

> Promise base pixiv API client

<img src="media/image.jpg" width=200>

Inspired by  [upbit/pixivpy: Pixiv API for Python](https://github.com/upbit/pixivpy).


## Features

- Promise base
- Converts the output json key to camelCase
- Converts the parameter to snakeCase
- Supports API without login


## Install

```
$ npm install --save pixiv-app-api
```


## Usage

```js
const PixivAppApi = require('pixiv-app-api');
const pixivImg = require('pixiv-img');
const pixiv = new PixivAppApi();

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

#### constructor(username?: string, password?: string): PixivAppApi;
#### login(username?: string, password?: string): Promise<Object>;
#### authInfo(): Object;
#### hasNext(): bool;
#### next(): Promise<string>;
#### nextQuery(): string;
#### userDetail(id: ID, params?: Object): Promise<Object>;
#### userIllusts(id: ID, params?: Object): Promise<Object>;
#### userFollowAdd(id: ID, data?: Object): Promise<Object>;
#### userFollowDelete(id: ID, data?: Object): Promise<Object>;
#### userBookmarksIllust(id: ID, params?: Object): Promise<Object>;
#### userFollowing(id: ID, params?: Object): Promise<Object>;
#### userFollower(id: ID, params?: Object): Promise<Object>;
#### userMypixiv(id: ID, params?: Object): Promise<Object>;
#### userList(id: ID, params?: Object): Promise<Object>;
#### illustDetail(id: ID, params?: Object): Promise<Object>;
#### illustNew(params?: Object): Promise<Object>;
#### illustFollow(params?: Object): Promise<Object>;
#### illustComments(id: ID, params?: Object): Promise<Object>;
#### illustRelated(id: ID, params?: Object): Promise<Object>;
#### illustRecommended(params?: Object): Promise<Object>;
#### illustRecommendedNologin(params?: Object): Promise<Object>;
#### illustRanking(params?: Object): Promise<Object>;
#### trendingTagsIllust(params?: Object): Promise<Object>;
#### searchIllust(word: Word, params?: Object): Promise<Object>;
#### searchNovel(word: Word, params?: Object): Promise<Object>;
#### searchUser(word: Word, params?: Object): Promise<Object>;
#### searchAutoComplete(word: Word): Promise<Object>;
#### illustBookmarkDetail(id: ID, params?: Object): Promise<Object>;
#### illustBookmarkAdd(id: ID, data?: Object): Promise<Object>;
#### illustBookmarkDelete(id: ID, data?: Object): Promise<Object>;
#### userBookmarkTagsIllust(params?: Object): Promise<Object>;
#### novelRecommended(params?: Object): Promise<Object>;
#### mangaNew(params?: Object): Promise<Object>;
#### mangaRecommended(params?: Object): Promise<Object>;
#### novelRecommendedNologin(params?: Object): Promise<Object>;
#### novelNew(params?: Object): Promise<Object>;
#### fetch(target: string, opts?: Object): Promise<Object>;

See [Sniffer for iOS 6.x Common API · upbit/pixivpy Wiki](https://github.com/upbit/pixivpy/wiki/Sniffer-for-iOS-6.x---Common-API)

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

- [PixivDeck](https://github.com/akameco/PixivDeck) - pixiv client for Desktop like TweetDeck
- [pixiv-img](https://github.com/akameco/pixiv-img) - save the image of pixiv
- [pixiv-dl](https://github.com/akameco/pixiv-dl) - pixiv image downloader
- [pixiv-dl-preview](https://github.com/akameco/pixiv-dl-preview) - electron pixiv downloader

## License

MIT © [akameco](http://akameco.github.io)
