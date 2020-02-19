# pixiv-app-api

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)

> Promise based pixiv API client

<img src="media/image.jpg" width=200>

Inspired by [upbit/pixivpy: Pixiv API for Python](https://github.com/upbit/pixivpy).

## Features

- Promise based
- Converts the output json keys to camelCase
- Converts the parameters to snakeCase
- Supports API without login

## Install

```
$ npm install --save pixiv-app-api
```

## Usage

```js
import PixivAppApi from 'pixiv-app-api' //const PixivAppApi = require("pixiv-app-api")
import pixivImg from 'pixiv-img' //const pixivImg = require("pixiv-img")
const pixiv = new PixivAppApi(process.env.NAME, process.env.PASSWORD, {
  camelcaseKeys: true
})

;(async () => {
  await pixiv.login()
  const json = await pixiv.searchIllust('艦これ10000users入り')
  await pixivImg(json.illusts[0].imageUrls.large)
  console.log('finish')
})()
```

## Typescript

All functions will return either a camelCaseType or a snake_case_type depending on the value of `camelcaseKeys`.
For example:

```ts
//const pixiv = new PixivAppApi(process.env.NAME, process.env.PASSWORD, {camelcaseKeys: true})
interface PixivClient = {
  accessToken: string
  expiresIn: number
  tokenType: string
  scope: string
  refreshToken: string
  user: PixivClientUser
  deviceToken: string
}

//const pixiv = new PixivAppApi(process.env.NAME, process.env.PASSWORD, {camelcaseKeys: false})
interface Pixiv_Client = {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
  user: Pixiv_Client_User
  device_token: string
}
```

## API

#### `constructor(username?: string, password?: string, options? {camelcaseKeys?: boolean})`

Creates a new PixivAppApi object. `camelcaseKeys` defaults to `true` if it is omitted.

#### `login(username?: string, password?: string): Promise<PixivClient>`

Logs into the API.

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
      "px16x16": "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_16.png",
      "px50x50": "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_50.png",
      "px170x170": "https://i.pximg.net/user-profile/img/2016/12/07/18/45/34/11842543_d51209fed2b2566336b1296e07f49b81_170.png"
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

#### `authInfo(): PixivClient`

Gets your authInfo.

```ts
interface PixivClient {
  accessToken: string
  expiresIn: number
  tokenType: string
  scope: string
  refreshToken: string
  user: PixivClientUser
  deviceToken: string
}
```

#### `makeIterable(resp: Object): AsyncIterable<Object>`

<details>

```js
const json = await pixiv.searchIllust('艦これ10000users入り')
let ar = []
for await (const r of pixiv.makeIterable(json)){
  ar = ar.concat(r.illusts)
  await sleep(1000) // if the request rate is too high, pixiv might ban you
}
console.log(ar.length)
```

</details>

#### `userDetail(id: ID, params?: PixivParams): Promise<PixivUserDetail>.`

Get a user's profile.

<details>

```ts
export interface PixivUserDetail {
  user: PixivUser
  profile: {
    webpage: string
    gender: string
    birth: string
    birthDay: string
    birthYear: number
    region: string
    addressId: number
    countryCode: string
    job: string
    jobId: number
    totalFollowUsers: number
    totalMypixivUsers: number
    totalIllusts: number
    totalManga: number
    totalNovels: number
    totalIllustBookmarksPublic: number
    totalIllustSeries: number
    backgroundImageUrl: string
    twitterAccount: string
    twitterUrl: string
    pawooUrl: string
    isPremium: boolean
    isUsingCustomProfileImage: boolean
  }
  profilePublicity: {
    gender: string
    region: string
    birthDay: string
    birthYear: string
    job: string
    pawoo: boolean
  }
  workspace: {
    pc: string
    monitor: string
    tool: string
    scanner: string
    tablet: string
    mouse: string
    printer: string
    desktop: string
    music: string
    desk: string
    chair: string
    comment: string
    workspaceImageUrl: string | null
  }
}
```

</details>

The type PixivParams is defined as follows:

```ts
export interface PixivParams {
  userId?: number
  type?: string
  filter?: string
  restrict?: 'public' | 'private'
  illustId?: number
  contentType?: string
  includeTotalComments?: boolean
  includeRankingLabel?: boolean
  includeRankingIllusts?: boolean
  includeRankingNovels?: boolean
  mode?:
    | 'day'
    | 'week'
    | 'month'
    | 'day_male'
    | 'day_female'
    | 'week_original'
    | 'week_rookie'
    | 'day_r18'
    | 'day_male_r18'
    | 'day_female_r18'
    | 'week_r18'
    | 'week_r18g'
    | 'day_manga'
    | 'week_manga'
    | 'month_manga'
    | 'week_rookie_manga'
    | 'day_r18_manga'
    | 'week_r18_manga'
    | 'week_r18g_manga'
  word?: string
  searchTarget?:
    | 'partial_match_for_tags'
    | 'exact_match_for_tags'
    | 'title_and_caption'
  sort?: 'date_desc' | 'date_asc' | 'popular_desc'
  startDate?: string
  endDate?: string
  offset?: number
}
```

#### `userIllusts(id: ID, params?: PixivParams): Promise<PixivIllustSearch>`

Retrieves all of a users illusts.

```ts
export interface PixivIllustSearch {
  illusts: PixivIllust[]
  nextUrl: string | null
  searchSpanLimit?: number
}
```

<details>

```json
{
  "illusts": [
    {
      "id": 64124918,
      "title": "Noise Pollution Vol.3",
      "type": "illust",
      "imageUrls": {
        "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p0_square1200.jpg",
        "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
        "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg"
      },
      "caption": "夏コミ新刊の②<br /><br />東レ54b-CREAYUS<br />Noise Pollution Vol.3には会場限定A5サイズのクリアファイルがつきます。１冊につき１枚（先着）、なくなり次第終了です。<br /><br />とらのあな予約(フルカラー全年齢)<br /><a href=\"http://www.toranoana.jp/mailorder/article/04/0030/54/88/040030548805.html?rec=circle\" target=\"_blank\">http://www.toranoana.jp/mailorder/article/04/0030/54/88/040030548805.html?rec=circle</a>",
      "restrict": 0,
      "user": {
        "id": 471355,
        "name": "嵐月",
        "account": "creayus",
        "profileImageUrls": {
          "medium": "https://i3.pixiv.net/user-profile/img/2014/02/02/00/05/39/7393018_f1ce44676a8c0d902cc49aad2828e510_170.jpg"
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
            "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p0_square1200.jpg",
            "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
            "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p0_master1200.jpg",
            "original": "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p0.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p1_square1200.jpg",
            "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p1_master1200.jpg",
            "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p1_master1200.jpg",
            "original": "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p1.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p2_square1200.jpg",
            "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p2_master1200.jpg",
            "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p2_master1200.jpg",
            "original": "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p2.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p3_square1200.jpg",
            "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p3_master1200.jpg",
            "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p3_master1200.jpg",
            "original": "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p3.png"
          }
        },
        {
          "imageUrls": {
            "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2017/07/30/12/20/55/64124918_p4_square1200.jpg",
            "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2017/07/30/12/20/55/64124918_p4_master1200.jpg",
            "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2017/07/30/12/20/55/64124918_p4_master1200.jpg",
            "original": "https://i.pximg.net/img-original/img/2017/07/30/12/20/55/64124918_p4.png"
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
  "nextUrl": "https://app-api.pixiv.net/v1/user/illusts?user_id=471355&type=illust&filter=for_ios&offset=40"
}
```

</details>

#### `userFollowAdd(id: ID, data?: Object): Promise<unknown>`

Follows a user.

#### `userFollowDelete(id: ID, data?: Object): Promise<unknown>`

Unfollows a user.

#### `userBookmarksIllust(id: ID, params?: PixivParams): Promise<PixivIllustSearch>`

Gets a user's bookmarked illusts.

#### `userFollowing(id: ID, params?: PixivParams): Promise<PixivUserSearch>`

Gets the users that a user is following.

```ts
export interface PixivUserSearch {
  userPreviews: {
    user: PixivUser
    illusts: PixivIllust[]
    novels: PixivNovel[]
    isMuted: boolean
  }[]
  nextUrl: string | null
}
```

#### `userFollower(id: ID, params?: PixivParams): Promise<PixivUserSearch>`

Gets the users who follow a user.

#### `userMypixiv(id: ID, params?: PixivParams): Promise<PixivUserSearch>`

Gets your friends on Mypixiv.

#### `userList(id: ID, params?: PixivParams): Promise<unknown>`

Gets a user list.

#### `illustDetail(id: ID, params?: PixivParams): Promise<PixivIllustDetail>`

Returns detailed info for a pixiv illust.

```ts
export interface PixivIllustDetail {
  illust: PixivIllust
}

export interface PixivIllust {
  id: number
  title: string
  interface: string
  imageUrls: {
    squareMedium: string
    medium: string
    large?: string
  }
  caption: string
  restrict: number
  user: PixivUser
  tags: PixivTag[]
  tools: string[]
  createDate: string
  pageCount: number
  width: number
  height: number
  sanityLevel: number
  metaSinglePage: {
    originalImageUrl?: string
  }
  metaPages: PixivMetaPage[]
  totalView: number
  totalBookmarks: number
  isBookmarked: boolean
  visible: boolean
  isMuted: boolean
  totalComments: number
}
```

<details>

```json
{
  "illust": {
    "id": 57907953,
    "title": "ロングヘアレムりん",
    "type": "illust",
    "imageUrls": {
      "squareMedium": "https://i.pximg.net/c/360x360_70/img-master/img/2016/07/15/00/08/24/57907953_p0_square1200.jpg",
      "medium": "https://i.pximg.net/c/540x540_70/img-master/img/2016/07/15/00/08/24/57907953_p0_master1200.jpg",
      "large": "https://i.pximg.net/c/600x1200_90/img-master/img/2016/07/15/00/08/24/57907953_p0_master1200.jpg"
    },
    "caption": "デイリー32→5 ありがとうございます！",
    "restrict": 0,
    "user": {
      "id": 3424578,
      "name": "こーやふ@三日目東に26b",
      "account": "burittohiroba",
      "profileImageUrls": {
        "medium": "https://i2.pixiv.net/user-profile/img/2017/02/07/16/03/00/12115481_03cc0ec0f2580ac4a12a3682929b485a_170.jpg"
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
      "originalImageUrl": "https://i.pximg.net/img-original/img/2016/07/15/00/08/24/57907953_p0.jpg"
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

#### `illustNew(params?: PixivParams): Promise<PixivIllustSearch>`

Searches new illusts.

#### `illustFollow(params?: PixivParams): Promise<PixivIllustSearch>`

Searches new illusts from users you follow.

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
    }
  ],
  "nextUrl": "https://app-api.pixiv.net/v2/illust/follow?restrict=public&offset=30"
}
```

</details>

#### `illustComments(id: ID, params?: PixivParams): Promise<PixivCommentSearch>`

Returns the comments on an illust.

```ts
export interface PixivCommentSearch {
  totalComments: number
  comments: PixivComment[]
  nextUrl: string | null
}
```

#### `illustRelated(id: ID, params?: PixivParams): Promise<PixivIllustSearch>`

Searches for illusts related to the one provided.

#### `illustRecommended(params?: PixivParams): Promise<PixivIllustSearch>`

Returns recommended illusts.

#### `illustRecommendedNologin(params?: PixivParams): Promise<PixivIllustSearch>`

Returns recommended illusts (logged out).

#### `illustRanking(params?: PixivParams): Promise<PixivIllustSearch>`

Returns top daily illusts by default.

#### `trendingTagsIllust(params?: PixivParams): Promise<PixivTrendTags>`

Returns an array of trending tags.

```ts
export interface PixivTrendTags {
  trend_tags: PixivTag[]
}
```

#### `searchIllust(word: Word, params?: PixivParams): Promise<PixivIllustSearch>`

Searches for illusts with the provided query.

#### `searchNovel(word: Word, params?: PixivParams): Promise<PixivNovelSearch>`

Searches for novels with the provided query.

```ts
export interface PixivNovelSearch {
  novels: PixivNovel[]
  nextUrl: string | null
  privacyPolicy?: {}
  searchSpanLimit?: number
}
```

#### `searchUser(word: Word, params?: PixivParams): Promise<PixivUserSearch>`

Searches for users with the provided query.

#### `searchAutoComplete(word: Word): Promise<PixivAutoComplete>`

Returns an array of auto-completed words from the input.

```ts
export interface PixivAutoComplete {
  searchAutoCompleteKeywords: string[]
}
```

#### `illustBookmarkDetail(id: ID, params?: PixivParams): Promise<PixivBookmarkDetail>`

Returns detailed info on a bookmark.

```ts
export interface PixivBookmarkDetail {
  isBookmarked: boolean
  tags: PixivTag[]
  restrict: string
}
```

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

#### `illustBookmarkAdd(id: ID, data?: Object): Promise<unknown>`

Adds a new bookmark.

#### `illustBookmarkDelete(id: ID, data?: Object): Promise<unknown>`

Deletes a bookmark.

#### `userBookmarkTagsIllust(params?: PixivParams): Promise<PixivBookmarkSearch>`

Searches your bookmark tags.

```ts
export interface PixivBookmarkSearch {
  bookmarkTags: PixivTag[]
  nextUrl: string | null
}
```

<details>

```json
{
  "bookmarkTags": [],
  "nextUrl": null
}
```

</details>

#### `novelRecommended(params?: PixivParams): Promise<PixivNovelSearch>`

Searches recommended novels.

#### `mangaNew(params?: PixivParams): Promise<unknown>`

Searches new manga.

#### `mangaRecommended(params?: PixivParams): Promise<PixivMangaSearch>`

Searches recommended manga.

```ts
export interface PixivMangaSearch {
  illusts: PixivManga[]
  rankingIllusts: PixivManga[] | []
  privacyPolicy: {}
  nextUrl: string | null
}
```

#### `novelRecommendedNologin(params?: PixivParams): Promise<PixivNovelSearch>`

Searches recommended novels (logged out).

#### `novelNew(params?: PixivParams): Promise<PixivNovelSearch>`

Searches new novels.

#### `ugoiraMetaData(id: number, params?: PixivParams): Promise<UgoiraMetaData>`

Retrieves the zip url and frames for a Pixiv Ugoira.

```ts
export interface UgoiraMetaData {
  ugoiraMetadata: {
    zipUrls: {
      medium: string
    }
    frames: {
      file: string
      delay: number
    }[]
  }
}
```

#### `fetch(target: string, opts?: PixivFetchOptions): Promise<any>`

Fetches a route in the Pixiv API and returns the result.

See [Sniffer for iOS 6.x Common API · upbit/pixivpy Wiki](https://github.com/upbit/pixivpy/wiki/Sniffer-for-iOS-6.x---Common-API)

#### `pixiv.next(): Promise<any>`

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

#### `pixiv.hasNext(): boolean`

Return `true` if `pixiv.next()` is able to run.

##### usage

```js
if (pixiv.hasNext()) {
  pixiv.next().then()
}
```

#### `pixiv.nextQuery(): Promise<string | undefined>`

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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://akameco.github.io"><img src="https://avatars2.githubusercontent.com/u/4002137?v=4" width="100px;" alt="akameco"/><br /><sub><b>akameco</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=akameco" title="Code">💻</a> <a href="https://github.com/akameco/pixiv-app-api/commits?author=akameco" title="Documentation">📖</a> <a href="https://github.com/akameco/pixiv-app-api/commits?author=akameco" title="Tests">⚠️</a> <a href="#infra-akameco" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://austinhuang.me"><img src="https://avatars1.githubusercontent.com/u/16656689?v=4" width="100px;" alt="Austin Huang"/><br /><sub><b>Austin Huang</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=austinhuang0131" title="Code">💻</a> <a href="https://github.com/akameco/pixiv-app-api/commits?author=austinhuang0131" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/najimi"><img src="https://avatars3.githubusercontent.com/u/2237174?v=4" width="100px;" alt="Cake"/><br /><sub><b>Cake</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=najimi" title="Code">💻</a> <a href="https://github.com/akameco/pixiv-app-api/commits?author=najimi" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/adefirmanf/"><img src="https://avatars0.githubusercontent.com/u/23324722?v=4" width="100px;" alt="Ade Firman Fauzi"/><br /><sub><b>Ade Firman Fauzi</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=adefirmanf" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/jiefenghe/"><img src="https://avatars0.githubusercontent.com/u/4796423?v=4" width="100px;" alt="yeti2018"/><br /><sub><b>yeti2018</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=yeti2018" title="Code">💻</a></td>
    <td align="center"><a href="https://blog.maple3142.net/"><img src="https://avatars1.githubusercontent.com/u/9370547?v=4" width="100px;" alt="maple"/><br /><sub><b>maple</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=maple3142" title="Code">💻</a></td>
    <td align="center"><a href="https://www.youtube.com/tenpi"><img src="https://avatars1.githubusercontent.com/u/37512637?v=4" width="100px;" alt="Tenpi"/><br /><sub><b>Tenpi</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=Tenpi" title="Code">💻</a> <a href="https://github.com/akameco/pixiv-app-api/commits?author=Tenpi" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://yanagiragi.wordpress.com"><img src="https://avatars2.githubusercontent.com/u/7404517?v=4" width="100px;" alt="yanagiragi"/><br /><sub><b>yanagiragi</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=yanagiragi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/NigridsVa"><img src="https://avatars2.githubusercontent.com/u/4570860?v=4" width="100px;" alt="NigridsVa"/><br /><sub><b>NigridsVa</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=NigridsVa" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Antosik"><img src="https://avatars1.githubusercontent.com/u/4852791?v=4" width="100px;" alt="Anton Grigoryev"/><br /><sub><b>Anton Grigoryev</b></sub></a><br /><a href="https://github.com/akameco/pixiv-app-api/commits?author=Antosik" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT © [akameco](http://akameco.github.io)
