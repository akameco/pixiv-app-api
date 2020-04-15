import { stringify } from 'querystring'
import { createHash as cryptoCreateHash } from 'crypto'
import { parse as urlParse } from 'url'
import axios, { AxiosRequestConfig } from 'axios'
import decamelizeKeys from 'decamelize-keys'
import camelcaseKeys from 'camelcase-keys'
import {
  Pixiv_Client,
  Pixiv_User_Detail,
  Pixiv_Illust_Search,
  Pixiv_User_Search,
  Pixiv_Illust_Detail,
  Pixiv_Comment_Search,
  Pixiv_Trend_Tags,
  Pixiv_Novel_Search,
  Pixiv_Auto_Complete,
  Pixiv_Bookmark_Detail,
  Pixiv_Bookmark_Search,
  Ugoira_Meta_Data,
  Pixiv_Manga_Search,
} from './Pixiv_Types'
import {
  PixivClient,
  PixivIllustSearch,
  PixivRequestData,
  PixivParams,
  PixivFetchOptions,
  PixivBookmarkDetail,
  PixivBookmarkSearch,
  PixivUserDetail,
  PixivUserSearch,
  PixivIllustDetail,
  PixivCommentSearch,
  PixivNovelSearch,
  PixivAutoComplete,
  UgoiraMetaData,
  PixivMangaSearch,
  PixivTrendTags,
} from './PixivTypes'

const baseURL = 'https://app-api.pixiv.net/'
const instance = axios.create({
  baseURL,
  headers: {
    'App-OS': 'ios',
    'App-OS-Version': '9.3.3',
    'App-Version': '6.0.9',
  },
})

const CLIENT_ID = 'MOBrBDS8blbauoSck0ZfDbtuzpyT'
const CLIENT_SECRET = 'lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj'
const HASH_SECRET =
  '28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c'
const filter = 'for_ios'

export default class PixivApp<CamelcaseKeys extends boolean = true> {
  camelcaseKeys: CamelcaseKeys
  username: string | undefined
  password: string | undefined
  refreshToken: string
  nextUrl: string | null
  auth: PixivClient | null
  private _once: boolean

  constructor(
    username?: string,
    password?: string,
    options?: { camelcaseKeys?: CamelcaseKeys }
  ) {
    this.username = username
    this.password = password
    this.refreshToken = ''
    this.nextUrl = null
    this.auth = null
    this._once = false
    if (options) {
      this.camelcaseKeys = Boolean(options.camelcaseKeys) as CamelcaseKeys
    } else {
      this.camelcaseKeys = true as CamelcaseKeys
    }
  }

  async login(
    username?: string,
    password?: string
  ): Promise<CamelcaseKeys extends true ? PixivClient : Pixiv_Client> {
    this.username = username || this.username
    this.password = password || this.password

    if (typeof this.username !== 'string') {
      return Promise.reject(
        new TypeError(
          `Auth is required. Expected a string, got ${typeof this.username}`
        )
      )
    }

    if (typeof this.password !== 'string') {
      return Promise.reject(
        new TypeError(
          `Auth is required. Expected a string, got ${typeof this.password}`
        )
      )
    }

    const now_time = new Date()
    const local_time = `${now_time.getUTCFullYear()}-${
      now_time.getUTCMonth() + 1
    }-${now_time.getUTCDate()}T${now_time
      .getUTCHours()
      .toString()
      .padStart(2, '0')}:${now_time
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${now_time
      .getUTCSeconds()
      .toString()
      .padStart(2, '0')}+00:00`

    const headers = {
      'X-Client-Time': local_time,
      'X-Client-Hash': cryptoCreateHash('md5')
        .update(Buffer.from(`${local_time}${HASH_SECRET}`, 'utf8'))
        .digest('hex'),
    }

    const data: PixivRequestData = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      getSecureUrl: '1',
      grantType: '',
      username: '',
      password: '',
      refreshToken: '',
    }

    if (this.refreshToken === '') {
      data.grantType = 'password'
      data.username = this.username
      data.password = this.password
    } else {
      data.grantType = 'refresh_token'
      data.refreshToken = this.refreshToken
    }

    const axiosResponse = await axios.post(
      'https://oauth.secure.pixiv.net/auth/token',
      stringify(decamelizeKeys(data)),
      { headers }
    )

    const { response } = axiosResponse.data
    this.auth = response
    this.refreshToken = axiosResponse.data.response.refresh_token
    this.authToken = response.access_token
    return this.camelcaseKeys
      ? camelcaseKeys(response, { deep: true })
      : response
  }

  authInfo(): CamelcaseKeys extends true ? PixivClient : Pixiv_Client {
    type authInfoType = CamelcaseKeys extends true ? PixivClient : Pixiv_Client
    return this.camelcaseKeys
      ? ((camelcaseKeys(this.auth!, {
          deep: true,
        }) as unknown) as authInfoType)
      : (this.auth as authInfoType)
  }

  // eslint-disable-next-line class-methods-use-this
  set authToken(accessToken: string) {
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  hasNext(): boolean {
    return Boolean(this.nextUrl)
  }

  next(): Promise<any> {
    return this.fetch(this.nextUrl!)
  }

  nextQuery(): undefined | string {
    // This always returns undefined
    // @ts-ignore
    return urlParse(this.nextUrl!, true).params
  }

  makeIterable(resp: any): AsyncIterable<any> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const nextUrl = this.camelcaseKeys ? 'nextUrl' : 'next_url'
    return {
      async *[Symbol.asyncIterator]() {
        yield resp
        while (resp[nextUrl]) {
          // eslint-disable-next-line require-atomic-updates
          resp = await self.fetch(resp[nextUrl])
          yield resp
        }
      },
    }
  }

  userDetail(
    id: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserDetail : Pixiv_User_Detail> {
    params = {
      userId: id,
      filter,
      ...params,
    }
    return this.fetch('/v1/user/detail', { params })
  }

  userIllusts(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      userId: id,
      type: 'illust',
      filter,
      ...params,
    }
    return this.fetch('/v1/user/illusts', { params })
  }

  // This endpoint doesn't exist
  userFollowAdd(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      restrict: 'public',
      filter,
      ...params,
    }
    return this.fetch('/v1/user/follow/add', { params })
  }

  // This endpoint doesn't exist
  userFollowDelete(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      restrict: 'public',
      filter,
      ...params,
    }
    return this.fetch('/v1/user/follow/delete', { params })
  }

  userBookmarksIllust(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      restrict: 'public',
      filter,
      ...params,
    }
    return this.fetch('/v1/user/bookmarks/illust', { params })
  }

  userFollowing(
    id: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      restrict: 'public',
      ...params,
    }
    return this.fetch('/v1/user/following', { params })
  }

  userFollower(
    id: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      ...params,
    }
    return this.fetch('/v1/user/follower', { params })
  }

  userMypixiv(
    id: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      ...params,
    }

    return this.fetch('/v1/user/mypixiv', { params })
  }

  // This endpoint doesn't exist
  userList(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId: id,
      filter,
      ...params,
    }

    return this.fetch('/v1/user/list', { params })
  }

  illustDetail(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustDetail : Pixiv_Illust_Detail
  > {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      filter,
      ...params,
    }

    return this.fetch('/v1/illust/detail', { params })
  }

  illustNew(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      contentType: 'illust',
      filter,
      ...params,
    }
    return this.fetch('/v1/illust/new', { params })
  }

  illustFollow(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      userId: id,
      restrict: 'public',
      ...params,
    }
    return this.fetch('/v2/illust/follow', { params })
  }

  illustComments(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivCommentSearch : Pixiv_Comment_Search
  > {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      includeTotalComments: true,
      ...params,
    }
    return this.fetch('/v1/illust/comments', { params })
  }

  illustRelated(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      filter,
      ...params,
    }
    return this.fetch('/v2/illust/related', { params })
  }

  illustRecommended(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      contentType: 'illust',
      includeRankingLabel: true,
      filter,
      ...params,
    }

    return this.fetch('/v1/illust/recommended', { params })
  }

  illustRecommendedNologin(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      includeRankingIllusts: true,
      filter,
      ...params,
    }
    return this.fetch('/v1/illust/recommended-nologin', { params })
  }

  illustRanking(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      mode: 'day',
      filter,
      ...params,
    }
    return this.fetch('/v1/illust/ranking', { params })
  }

  trendingTagsIllust(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivTrendTags : Pixiv_Trend_Tags> {
    params = {
      filter,
      ...params,
    }
    return this.fetch('/v1/trending-tags/illust', { params })
  }

  searchIllust(
    word: string,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    if (!word) {
      return Promise.reject(new Error('Word required'))
    }
    params = {
      word,
      searchTarget: 'partial_match_for_tags',
      sort: 'date_desc',
      filter,
      ...params,
    }
    return this.fetch('/v1/search/illust', { params })
  }

  searchNovel(
    word: string,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search
  > {
    if (!word) {
      return Promise.reject(new Error('Word required'))
    }
    params = {
      word,
      searchTarget: 'partial_match_for_tags',
      sort: 'date_desc',
      filter,
      ...params,
    }
    return this.fetch('/v1/search/novel', { params })
  }

  searchUser(
    word: string,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!word) {
      return Promise.reject(new Error('Word required'))
    }
    params = {
      word,
      filter,
      ...params,
    }
    return this.fetch('/v1/search/user', { params })
  }

  searchAutoComplete(
    word: string
  ): Promise<
    CamelcaseKeys extends true ? PixivAutoComplete : Pixiv_Auto_Complete
  > {
    if (!word) {
      return Promise.reject(new Error('word required'))
    }
    return this.fetch('/v1/search/autocomplete', { params: { word } })
  }

  illustBookmarkDetail(
    id: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkDetail : Pixiv_Bookmark_Detail
  > {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      ...params,
    }
    return this.fetch('/v2/illust/bookmark/detail', { params })
  }

  illustBookmarkAdd(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      restrict: 'public',
      ...params,
    }

    return this.fetch('/v2/illust/bookmark/add', { data: params })
  }

  illustBookmarkDelete(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      ...params,
    }
    return this.fetch('/v1/illust/bookmark/delete', { data: params })
  }

  userBookmarkTagsIllust(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkSearch : Pixiv_Bookmark_Search
  > {
    params = {
      restrict: 'public',
      ...params,
    }
    return this.fetch('/v1/user/bookmark-tags/illust', { params })
  }

  novelRecommended(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search
  > {
    params = {
      includeRankingNovels: true,
      filter,
      ...params,
    }
    return this.fetch('/v1/novel/recommended', { params })
  }

  // This endpoint doesn't exist
  mangaNew(params?: PixivParams): Promise<unknown> {
    params = {
      contentType: 'manga',
      filter,
      ...params,
    }
    return this.fetch('/v1/manga/new', { params })
  }

  mangaRecommended(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivMangaSearch : Pixiv_Manga_Search
  > {
    params = {
      includeRankingLabel: true,
      filter,
      ...params,
    }
    return this.fetch('/v1/manga/recommended', { params })
  }

  novelRecommendedNologin(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search
  > {
    params = {
      includeRankingNovels: true,
      filter,
      ...params,
    }

    return this.fetch('/v1/novel/recommended-nologin', { params })
  }

  novelNew(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search
  > {
    params = {
      filter,
      ...params,
    }
    return this.fetch('/v1/novel/new', { params })
  }

  ugoiraMetaData(
    id: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? UgoiraMetaData : Ugoira_Meta_Data> {
    if (!id) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId: id,
      filter,
      ...params,
    }
    return this.fetch('/v1/ugoira/metadata', { params })
  }

  async fetch(target: string, options?: PixivFetchOptions): Promise<any> {
    if (!target) {
      return Promise.reject(new Error('url required'))
    }

    try {
      return this._get(target, options)
    } catch (error) {
      if (this._once) {
        this._once = false
        throw error
      }
      await this.login()
      this._once = true
      return this._get(target, options)
    }
  }

  private async _get(
    target: string,
    options: PixivFetchOptions = {}
  ): Promise<any> {
    options = options || {}

    if (options.data) {
      options.method = 'post'
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      options.data = stringify(decamelizeKeys(options.data)) as PixivParams
    }

    if (options.params) {
      options.params = decamelizeKeys(options.params)
    }
    const { data } = await instance(target, options as AxiosRequestConfig)
    this.nextUrl = data && data.next_url ? data.next_url : null
    return this.camelcaseKeys ? camelcaseKeys(data, { deep: true }) : data
  }
}

module.exports.default = PixivApp
module.exports = PixivApp
