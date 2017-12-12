# pixiv-app-api [![Build Status](https://travis-ci.org/akameco/pixiv-app-api.svg?branch=master)](https://travis-ci.org/akameco/pixiv-app-api)

> Promise base pixiv API client

<img src="media/image.jpg" width=200>

Inspired by [upbit/pixivpy: Pixiv API for Python](https://github.com/upbit/pixivpy).

## Features

* Promise base
* Converts the output json key to camelCase
* Converts the parameter to snakeCase
* Supports API without login

## Install

```
$ npm install --save pixiv-app-api
```

## Usage

```js
const PixivAppApi = require('pixiv-app-api')
const pixivImg = require('pixiv-img')
const pixiv = new PixivAppApi()

pixiv
  .searchIllust('艦これ10000users入り')
  .then(json => {
    console.log(`downloading ${json.illusts[0].title}`)
    return pixivImg(json.illusts[0].image_urls.large)
  })
  .then(() => {
    console.log('finish')
  })
```

See examples.

## API

#### constructor(username?: string, password?: string): PixivAppApi;

#### login(username?: string, password?: string): Promise<Object>;

<details>

```json
{
  "accessToken": "abcdefgabcdefgabcdefgabcdefg",
  "expiresIn": 3600,
  "tokenType": "bearer",
  "scope": "unlimited",
  "refreshToken": "abcdefgabcdefgabcdefgabcdefg",
  "user": {
    "profileImageUrls": {
      "px16x16":
        "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_16.png",
      "px50x50":
        "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_50.png",
      "px170x170":
        "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_170.png"
    },
    "id": "19785907",
    "name": "akameco",
    "account": "akameco",
    "mailAddress": "abcdefgabcdefgabcdefgabcdefg",
    "isPremium": true,
    "xRestrict": 2,
    "isMailAuthorized": true
  }
}
```

</details>

#### authInfo(): Object;

#### hasNext(): bool;

#### next(): Promise<string>;

#### nextQuery(): string;

#### userDetail(id: ID, params?: Object): Promise<Object>;

#### userIllusts(id: ID, params?: Object): Promise<Object>;

<details>

```json
{
  "illusts": [
    {
      "id": 64124918,
      "title": "Noise Pollution Vol.3",
      "type": "illust",
      "imageUrls": {
        "squareMedium":
          "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p0_square1200.jpg",
        "medium":
          "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
        "large":
          "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg"
      },
      "caption":
        "夏コミ新刊の②<br /><br />東レ54b-CREAYUS<br />Noise Pollution Vol.3には会場限定A5サイズのクリアファイルがつきます。１冊につき１枚（先着）、なくなり次第終了です。<br /><br />とらのあな予約(フルカラー全年齢)<br /><a href=\"http://www.toranoana.jp/mailorder/article/04/0030/54/88/040030548805.html?rec=circle\" target=\"_blank\">http://www.toranoana.jp/mailorder/article/04/0030/54/88/040030548805.html?rec=circle</a>",
      "restrict": 0,
      "user": {
        "id": 471355,
        "name": "嵐月",
        "account": "creayus",
        "profileImageUrls": {
          "medium":
            "https://i3.pixiv.net/user-profile/img/2014/02/02/00/05/39/7393018_f1ce44676a8c0d902cc49aad2828e510_170.jpg"
        },
        "isFollowed": true
      },
      "tags": [
        {
          "name": "C.C."
        },
        {
          "name": "ルルーシュ"
        },
        {
          "name": "ルルC"
        },
        {
          "name": "コードギアス"
        },
        {
          "name": "コードギアス1000users入り"
        },
        {
          "name": "ルルーシュ・ランペルージ"
        }
      ],
      "tools": ["Photoshop", "SAI"],
      "createDate": "2017-07-30T12:20:55+09:00",
      "pageCount": 5,
      "width": 900,
      "height": 633,
      "sanityLevel": 4,
      "metaSinglePage": {},
      "metaPages": [
        {
          "imageUrls": {
            "squareMedium":
              "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p0_square1200.jpg",
            "medium":
              "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
            "large":
              "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
            "original":
              "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p0.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium":
              "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p1_square1200.jpg",
            "medium":
              "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p1_master1200.jpg",
            "large":
              "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p1_master1200.jpg",
            "original":
              "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p1.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium":
              "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p2_square1200.jpg",
            "medium":
              "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p2_master1200.jpg",
            "large":
              "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p2_master1200.jpg",
            "original":
              "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p2.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium":
              "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p3_square1200.jpg",
            "medium":
              "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p3_master1200.jpg",
            "large":
              "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p3_master1200.jpg",
            "original":
              "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p3.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium":
              "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p4_square1200.jpg",
            "medium":
              "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p4_master1200.jpg",
            "large":
              "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p4_master1200.jpg",
            "original":
              "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p4.png"
          }
        }
      ],
      "totalView": 45180,
      "totalBookmarks": 2358,
      "isBookmarked": false,
      "visible": true,
      "isMuted": false,
      "totalComments": 33
    }
  ],
  "nextUrl":
    "https://app-api.pixiv.net/v1/user/illusts?user_id=471355&type=illust&filter=for_ios&offset=40"
}
```

</details>
  
#### userFollowAdd(id: ID, data?: Object): Promise<Object>;
#### userFollowDelete(id: ID, data?: Object): Promise<Object>;
#### userBookmarksIllust(id: ID, params?: Object): Promise<Object>;
#### userFollowing(id: ID, params?: Object): Promise<Object>;
#### userFollower(id: ID, params?: Object): Promise<Object>;
#### userMypixiv(id: ID, params?: Object): Promise<Object>;
#### userList(id: ID, params?: Object): Promise<Object>;
#### illustDetail(id: ID, params?: Object): Promise<Object>;

<details>

```json
{
  "illust": {
    "id": 57907953,
    "title": "ロングヘアレムりん",
    "type": "illust",
    "imageUrls": {
      "squareMedium":
        "https://i.pximg.net/c/360x360_70/img-master/img/2016/07/15/00/08/24/57907953_p0_square1200.jpg",
      "medium":
        "https://i.pximg.net/c/540x540_70/img-master/img/2016/07/15/00/08/24/57907953_p0_master1200.jpg",
      "large":
        "https://i.pximg.net/c/600x1200_90/img-master/img/2016/07/15/00/08/24/57907953_p0_master1200.jpg"
    },
    "caption": "デイリー32→5 ありがとうございます！",
    "restrict": 0,
    "user": {
      "id": 3424578,
      "name": "こーやふ@三日目東に26b",
      "account": "burittohiroba",
      "profileImageUrls": {
        "medium":
          "https://i2.pixiv.net/user-profile/img/2017/02/07/16/03/00/12115481_03cc0ec0f2580ac4a12a3682929b485a_170.jpg"
      },
      "isFollowed": false
    },
    "tags": [
      {
        "name": "Re:ゼロから始める異世界生活"
      },
      {
        "name": "レム"
      },
      {
        "name": "リゼロ"
      },
      {
        "name": "レム(リゼロ)"
      },
      {
        "name": "ナツキ・レム"
      },
      {
        "name": "リゼロ10000users入り"
      },
      {
        "name": "スバレム"
      },
      {
        "name": "メイド"
      },
      {
        "name": "ロング化"
      }
    ],
    "tools": [],
    "createDate": "2016-07-15T00:08:24+09:00",
    "pageCount": 1,
    "width": 1000,
    "height": 1412,
    "sanityLevel": 2,
    "metaSinglePage": {
      "originalImageUrl":
        "https://i.pximg.net/img-original/img/2016/07/15/00/08/24/57907953_p0.jpg"
    },
    "metaPages": [],
    "totalView": 191059,
    "totalBookmarks": 28918,
    "isBookmarked": false,
    "visible": true,
    "isMuted": false,
    "totalComments": 181
  }
}
```

</details>
  
#### illustNew(params?: Object): Promise<Object>;
#### illustFollow(params?: Object): Promise<Object>;

<details>
  
```json
{
  "illusts": [
    {
      "id": 64419500,
      "title": "【PFRD】Chapter.6",
      "type": "illust",
      "imageUrls": {
        "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/08/15/00/16/32/64419500_p0_square1200.jpg",
        "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/08/15/00/16/32/64419500_p0_master1200.jpg",
        "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/08/15/00/16/32/64419500_p0_master1200.jpg"
      },
      "caption": "法尔卡岛.缇拉密林带 <br />挡在阿尔卡娜面前的数个复活者每个个体都带着伤，从摆起的架势来看也似乎毫无章法，但天生的直觉依然如同警铃般急促的敲打着阿尔卡娜的心。<br />“我这是在...害怕么？“感受到握剑的右手微微颤抖，阿尔卡娜自嘲的轻笑”呵..我还以为我已经忘了害怕是什么了呢”。<br /><br />来吧，不管【你们】是什么，堂堂正正的一决胜负吧！",
      "restrict": 0,
      "user": {
        "id": 22124330,
        "name": "超凶の狄璐卡",
        "account": "swd3e22",
        "profileImageUrls": {
          "medium": "https://i4.pixiv.net/user-profile/img/2017/01/10/13/28/42/11988991_bae951a38d31d217fa1eceedc0aafdbe_170.jpg"
        },
        "isFollowed": true
      },
      "tags": [
        {
          "name": "女の子"
        },
        {
          "name": "落書"
        },
        {
          "name": "オリジナル"
        },
        {
          "name": "グランメイル"
        },
        {
          "name": "pixivファンタジアRD"
        },
        {
          "name": "不敗王の復活"
        },
        {
          "name": "復活者討伐戦【青】"
        }
      ],
      "tools": [],
      "createDate": "2017-08-15T00:16:32+09:00",
      "pageCount": 1,
      "width": 2126,
      "height": 1150,
      "sanityLevel": 4,
      "metaSinglePage": {
        "originalImageUrl": "https://i.pximg.net/img-original/img/2017/08/15/00/16/32/64419500_p0.jpg"
      },
      "metaPages": [],
      "totalView": 228,
      "totalBookmarks": 63,
      "isBookmarked": false,
      "visible": true,
      "isMuted": false
    },
  ],
  "nextUrl": "https://app-api.pixiv.net/v2/illust/follow?restrict=public&offset=30"
}
```
  
</details>
  
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

<details>

```json
{
  "bookmarkDetail": {
    "isBookmarked": false,
    "tags": [
      {
        "name": "Re:ゼロから始める異世界生活",
        "isRegistered": false
      },
      {
        "name": "レム",
        "isRegistered": false
      },
      {
        "name": "リゼロ",
        "isRegistered": false
      },
      {
        "name": "レム(リゼロ)",
        "isRegistered": false
      },
      {
        "name": "ナツキ・レム",
        "isRegistered": false
      },
      {
        "name": "リゼロ10000users入り",
        "isRegistered": false
      },
      {
        "name": "スバレム",
        "isRegistered": false
      },
      {
        "name": "メイド",
        "isRegistered": false
      },
      {
        "name": "ロング化",
        "isRegistered": false
      }
    ],
    "restrict": "public"
  }
}
```

</details>

#### illustBookmarkAdd(id: ID, data?: Object): Promise<Object>;

#### illustBookmarkDelete(id: ID, data?: Object): Promise<Object>;

#### userBookmarkTagsIllust(params?: Object): Promise<Object>;

<details>

```json
{
  "bookmarkTags": [],
  "nextUrl": null
}
```

</details>
  
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
pixiv
  .searchIllust(word)
  .then(() => pixiv.next())
  .then(() => pixiv.next())
  .then(json => {
    console.log(json)
  })
```

#### pixiv.hasNext()

Return `true` if `pixiv.next()` is able to run.

##### usage

```js
if (pixiv.hasNext()) {
  pixiv.next().then()
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

* [PixivDeck](https://github.com/akameco/PixivDeck) - pixiv client for Desktop like TweetDeck
* [pixiv-img](https://github.com/akameco/pixiv-img) - save the image of pixiv
* [pixiv-dl](https://github.com/akameco/pixiv-dl) - pixiv image downloader
* [pixiv-dl-preview](https://github.com/akameco/pixiv-dl-preview) - electron pixiv downloader

## License

MIT © [akameco](http://akameco.github.io)
