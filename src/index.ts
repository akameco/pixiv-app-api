import { stringify } from 'querystring'
import crypto from 'crypto'
import url from 'url'
import axios, { AxiosRequestConfig } from 'axios'
import decamelizeKeys from 'decamelize-keys'
import camelcaseKeys from 'camelcase-keys'
import {
  Pixiv_Client,
  Pixiv_Client_User,
  Pixiv_Params,
  Pixiv_Request_Data,
  Pixiv_User,
  Pixiv_Tag,
  Pixiv_Meta_Page,
  Pixiv_Comment,
  Pixiv_Novel,
  Pixiv_Manga,
  Pixiv_User_Detail,
  Pixiv_Illust_Search,
  Pixiv_User_Search,
  Pixiv_Illust,
  Pixiv_Comment_Search,
  Pixiv_Trend_Tags,
  Pixiv_Novel_Search,
  Pixiv_Auto_Complete,
  Pixiv_Bookmark_Detail,
  Pixiv_Bookmark_Search,
  Ugoira_Meta_Data,
  Pixiv_Manga_Search
} from './Pixiv_Types'
import {
  PixivClient,
  PixivClientUser,
  PixivRequestData,
  PixivUser,
  PixivTag,
  PixivMetaPage,
  PixivComment,
  PixivNovel,
  PixivManga,
  PixivIllustSearch,
  PixivParams,
  PixivFetchOptions,
  PixivBookmarkDetail,
  PixivBookmarkSearch,
  PixivUserDetail,
  PixivUserSearch,
  PixivIllust,
  PixivCommentSearch,
  PixivNovelSearch,
  PixivAutoComplete,
  UgoiraMetaData,
  PixivMangaSearch,
  PixivTrendTags
} from './PixivTypes'

const baseURL = 'https://app-api.pixiv.net/'
const instance = axios.create({
  baseURL,
  headers: {
    'App-OS': 'ios',
    'App-OS-Version': '9.3.3',
    'App-Version': '6.0.9'
  }
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

    const local_time = new Date().toISOString()
    const headers = {
      'X-Client-Time': local_time,
      'X-Client-Hash': crypto
        .createHash('md5')
        .update(Buffer.from(`${local_time}${HASH_SECRET}`, 'utf8'))
        .digest('hex')
    }

    const data: PixivRequestData = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      getSecureUrl: '1',
      grantType: '',
      username: '',
      password: '',
      refreshToken: ''
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
    instance.defaults.headers.common.Authorization = `Bearer ${response.access_token}`
    return this.camelcaseKeys
      ? camelcaseKeys(response, { deep: true })
      : response
  }

  authInfo(): CamelcaseKeys extends true ? PixivClient : Pixiv_Client {
    type authInfoType = CamelcaseKeys extends true ? PixivClient : Pixiv_Client
    return this.camelcaseKeys
      ? ((camelcaseKeys(this.auth!, {
          deep: true
        }) as unknown) as authInfoType)
      : (this.auth as authInfoType)
  }

  hasNext(): boolean {
    return Boolean(this.nextUrl)
  }

  next(): Promise<any> {
    return this.fetch(this.nextUrl!)
  }

  nextQuery() {
    // @ts-ignore
    return url.parse(this.nextUrl!, true).params
  }

  nextParams(): Pixiv_Params | null {
    if (!this.nextUrl) {
      return null
    }
    const paramUrl = this.nextUrl.split('?')
    paramUrl.shift()
    const searchParams = new URLSearchParams(paramUrl.join(''))
    const params: any = {}
    for (const [key, value] of searchParams) {
      params[key] = value
    }
    return params
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
      }
    }
  }

  userDetail(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserDetail : Pixiv_User_Detail> {
    params = {
      userId,
      filter,
      ...params
    }
    return this.fetch('/v1/user/detail', { params })
  }

  userIllusts(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      userId,
      type: 'illust',
      filter,
      ...params
    }
    return this.fetch('/v1/user/illusts', { params })
  }

  // This endpoint doesn't exist
  userFollowAdd(userId: number, params?: PixivParams): Promise<unknown> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      restrict: 'public',
      filter,
      ...params
    }
    return this.fetch('/v1/user/follow/add', { params })
  }

  // This endpoint doesn't exist
  userFollowDelete(userId: number, params?: PixivParams): Promise<unknown> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      restrict: 'public',
      filter,
      ...params
    }
    return this.fetch('/v1/user/follow/delete', { params })
  }

  userBookmarksIllust(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      restrict: 'public',
      filter,
      ...params
    }
    return this.fetch('/v1/user/bookmarks/illust', { params })
  }

  userFollowing(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      restrict: 'public',
      ...params
    }
    return this.fetch('/v1/user/following', { params })
  }

  userFollower(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      ...params
    }
    return this.fetch('/v1/user/follower', { params })
  }

  userMypixiv(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      ...params
    }

    return this.fetch('/v1/user/mypixiv', { params })
  }

  // This endpoint doesn't exist
  userList(userId: number, params?: PixivParams): Promise<unknown> {
    if (!userId) {
      return Promise.reject(new Error('userId required'))
    }
    params = {
      userId,
      filter,
      ...params
    }

    return this.fetch('/v1/user/list', { params })
  }

  illustDetail(
    illustId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivIllust : Pixiv_Illust> {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      filter,
      ...params
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
      ...params
    }
    return this.fetch('/v1/illust/new', { params })
  }

  illustFollow(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      userId,
      restrict: 'public',
      ...params
    }
    return this.fetch('/v2/illust/follow', { params })
  }

  illustComments(
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivCommentSearch : Pixiv_Comment_Search
  > {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      includeTotalComments: true,
      ...params
    }
    return this.fetch('/v1/illust/comments', { params })
  }

  illustRelated(
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      filter,
      ...params
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
      ...params
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
      ...params
    }
    return this.fetch('/v1/illust/recommended-nologin', { params })
  }

  illustWalkthrough(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      filter,
      ...params
    }
    return this.fetch('/v1/walkthrough/illusts', { params })
  }

  illustRanking(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      mode: 'day',
      filter,
      ...params
    }
    return this.fetch('/v1/illust/ranking', { params })
  }

  illustPopularPreview(
    word: string,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  > {
    params = {
      word,
      filter,
      ...params
    }
    return this.fetch('/v1/search/popular-preview/illust', { params })
  }

  trendingTagsIllust(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivTrendTags : Pixiv_Trend_Tags> {
    params = {
      filter,
      ...params
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
      ...params
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
      ...params
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
      ...params
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
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkDetail : Pixiv_Bookmark_Detail
  > {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      ...params
    }
    return this.fetch('/v2/illust/bookmark/detail', { params })
  }

  // This endpoint doesn't exist
  illustBookmarkAdd(illustId: number, params?: PixivParams): Promise<unknown> {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      restrict: 'public',
      ...params
    }

    return this.fetch('/v2/illust/bookmark/add', { params })
  }

  // This endpoint doesn't exist
  illustBookmarkDelete(
    illustId: number,
    params?: PixivParams
  ): Promise<unknown> {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      ...params
    }
    return this.fetch('/v1/illust/bookmark/delete', { params })
  }

  userBookmarkTagsIllust(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkSearch : Pixiv_Bookmark_Search
  > {
    params = {
      restrict: 'public',
      ...params
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
      ...params
    }
    return this.fetch('/v1/novel/recommended', { params })
  }

  // This endpoint doesn't exist
  mangaNew(params?: PixivParams): Promise<unknown> {
    params = {
      contentType: 'manga',
      filter,
      ...params
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
      ...params
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
      ...params
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
      ...params
    }
    return this.fetch('/v1/novel/new', { params })
  }

  ugoiraMetaData(
    illustId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? UgoiraMetaData : Ugoira_Meta_Data> {
    if (!illustId) {
      return Promise.reject(new Error('illustId required'))
    }
    params = {
      illustId,
      filter,
      ...params
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
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      options.data = stringify(decamelizeKeys(options.data))
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

export {
  Pixiv_Client,
  Pixiv_Client_User,
  Pixiv_Params,
  Pixiv_Request_Data,
  Pixiv_User,
  Pixiv_Tag,
  Pixiv_Meta_Page,
  Pixiv_Comment,
  Pixiv_Novel,
  Pixiv_Manga,
  Pixiv_User_Detail,
  Pixiv_Illust_Search,
  Pixiv_User_Search,
  Pixiv_Illust,
  Pixiv_Comment_Search,
  Pixiv_Trend_Tags,
  Pixiv_Novel_Search,
  Pixiv_Auto_Complete,
  Pixiv_Bookmark_Detail,
  Pixiv_Bookmark_Search,
  Ugoira_Meta_Data,
  Pixiv_Manga_Search,
  PixivClient,
  PixivClientUser,
  PixivRequestData,
  PixivUser,
  PixivTag,
  PixivMetaPage,
  PixivComment,
  PixivNovel,
  PixivManga,
  PixivIllustSearch,
  PixivParams,
  PixivFetchOptions,
  PixivBookmarkDetail,
  PixivBookmarkSearch,
  PixivUserDetail,
  PixivUserSearch,
  PixivIllust,
  PixivCommentSearch,
  PixivNovelSearch,
  PixivAutoComplete,
  UgoiraMetaData,
  PixivMangaSearch,
  PixivTrendTags
}
