import {stringify} from "querystring"
import * as crypto from "crypto"
import url from "url"
import axios, {AxiosRequestConfig} from "axios"
import decamelizeKeys from "decamelize-keys"
import camelcaseKeys from "camelcase-keys"
import {
  Pixiv_Client,
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
} from "./Pixiv_Types"
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
  PixivIllust,
  PixivCommentSearch,
  PixivNovelSearch,
  PixivAutoComplete,
  UgoiraMetaData,
  PixivMangaSearch,
  PixivTrendTags
} from "./PixivTypes"

const baseURL = "https://app-api.pixiv.net/"
const instance = axios.create({
  baseURL,
  headers: {
    "App-OS": "ios",
    "App-OS-Version": "9.3.3",
    "App-Version": "6.0.9"
  }
})

const CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT"
const CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj"
const HASH_SECRET = "28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c"
const filter = "for_ios"

export default class PixivApp<B extends boolean> {
  public camelcaseKeys = true as B
  private username: string | undefined
  private password: string | undefined
  private refreshToken: string
  private nextUrl: string | null
  private auth: PixivClient | null
  private once: boolean

  constructor(username?: string, password?: string, options?: {camelcaseKeys?: B}) {
    this.username = username
    this.password = password
    this.refreshToken = ""
    this.nextUrl = null
    this.auth = null
    this.once = false
    if (options) {
      this.camelcaseKeys = Boolean(options.camelcaseKeys) as B
    }
  }

  public async login(username?: string, password?: string): Promise<B extends true ? PixivClient : Pixiv_Client> {
    this.username = username || this.username
    this.password = password || this.password

    if (typeof this.username !== "string" && typeof this.password !== "string") {
      return Promise.reject(
        new TypeError(`Auth is required.
        Expected a string, got ${typeof this.username !== "string" ? typeof this.username : typeof this.password}`)
      )
    }

    const local_time = new Date().toISOString()
    const headers = {
      "X-Client-Time": local_time,
      "X-Client-Hash": crypto
        .createHash("md5")
        .update(Buffer.from(`${local_time}${HASH_SECRET}`, "utf8"))
        .digest("hex")
    }

    const data: PixivRequestData = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      getSecureUrl: "1",
      grantType: "",
      username: "",
      password: "",
      refreshToken: ""
    }

    if (this.refreshToken === "") {
      data.grantType = "password"
      data.username = this.username!
      data.password = this.password!
    } else {
      data.grantType = "refresh_token"
      data.refreshToken = this.refreshToken
    }

    const axiosResponse = await axios.post("https://oauth.secure.pixiv.net/auth/token", stringify(decamelizeKeys(data)), {headers})

    const {response} = axiosResponse.data
    this.auth = response
    this.refreshToken = axiosResponse.data.response.refresh_token
    instance.defaults.headers.common.Authorization = `Bearer ${response.access_token}`
    return this.camelcaseKeys ? camelcaseKeys(response, {deep: true}) : response
  }

  public authInfo(): B extends true ? PixivClient : Pixiv_Client {
    type authInfoType = B extends true ? PixivClient : Pixiv_Client
    return this.camelcaseKeys
      ? ((camelcaseKeys(this.auth!, {
          deep: true
        }) as unknown) as authInfoType)
      : (this.auth as authInfoType)
  }

  public hasNext(): boolean {
    return Boolean(this.nextUrl)
  }

  public next(): Promise<any> {
    return this.fetch(this.nextUrl!)
  }

  public nextQuery(): undefined | string {
    // This always returns undefined
    // @ts-ignore
    return url.parse(this.nextUrl!, true).params
  }

  public makeIterable(resp: any): AsyncIterable<any> {
    const self = this
    const nextUrl = this.camelcaseKeys ? "nextUrl" : "next_url"
    return {
      async *[Symbol.asyncIterator]() {
        yield resp
        while (resp[nextUrl]) {
          resp = await self.fetch(resp[nextUrl])
          yield resp
        }
      }
    }
  }

  public userDetail(id: number, params?: PixivParams): Promise<B extends true ? PixivUserDetail : Pixiv_User_Detail> {
    params = {
      userId: id,
      filter,
      ...params
    }
    return this.fetch("/v1/user/detail", {params})
  }

  public userIllusts(id: number, params?: PixivParams): Promise<B extends true ? PixivIllustSearch[] : Pixiv_Illust_Search[]> {
    params = {
      userId: id,
      type: "illust",
      filter,
      ...params
    }
    return this.fetch("/v1/user/illusts", {params})
  }

  // This endpoint doesn't exist
  public userFollowAdd(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      restrict: "public",
      filter,
      ...params
    }
    return this.fetch("/v1/user/follow/add", {params})
  }

  // This endpoint doesn't exist
  public userFollowDelete(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      restrict: "public",
      filter,
      ...params
    }
    return this.fetch("/v1/user/follow/delete", {params})
  }

  public userBookmarksIllust(id: number, params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      restrict: "public",
      filter,
      ...params
    }
    return this.fetch("/v1/user/bookmarks/illust", {params})
  }

  public userFollowing(id: number, params?: PixivParams): Promise<B extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      restrict: "public",
      ...params
    }
    return this.fetch("/v1/user/following", {params})
  }

  public userFollower(id: number, params?: PixivParams): Promise<B extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      ...params
    }
    return this.fetch("/v1/user/follower", {params})
  }

  public userMypixiv(id: number, params?: PixivParams): Promise<B extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      ...params
    }

    return this.fetch("/v1/user/mypixiv", {params})
  }

  // This endpoint doesn't exist
  public userList(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error("userId required"))
    }
    params = {
      userId: id,
      filter,
      ...params
    }

    return this.fetch("/v1/user/list", {params})
  }

  public illustDetail(id: number, params?: PixivParams): Promise<B extends true ? PixivIllust : Pixiv_Illust> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      filter,
      ...params
    }

    return this.fetch("/v1/illust/detail", {params})
  }

  public illustNew(params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    params = {
      contentType: "illust",
      filter,
      ...params
    }
    return this.fetch("/v1/illust/new", {params})
  }

  public illustFollow(id: number, params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    params = {
      userId: id,
      restrict: "public",
      ...params
    }
    return this.fetch("/v2/illust/follow", {params})
  }

  public illustComments(id: number, params?: PixivParams): Promise<B extends true ? PixivCommentSearch : Pixiv_Comment_Search> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      includeTotalComments: "true",
      ...params
    }
    return this.fetch("/v1/illust/comments", {params})
  }

  public illustRelated(id: number, params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      filter,
      ...params
    }
    return this.fetch("/v2/illust/related", {params})
  }

  public illustRecommended(params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    params = {
      contentType: "illust",
      includeRankingLabel: true,
      filter,
      ...params
    }

    return this.fetch("/v1/illust/recommended", {params})
  }

  public illustRecommendedNologin(params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    params = {
      includeRankingIllusts: true,
      filter,
      ...params
    }
    return this.fetch("/v1/illust/recommended-nologin", {params})
  }

  public illustRanking(params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    params = {
      mode: "day",
      filter,
      ...params
    }
    return this.fetch("/v1/illust/ranking", {params})
  }

  public trendingTagsIllust(params?: PixivParams): Promise<B extends true ? PixivTrendTags : Pixiv_Trend_Tags> {
    params = {
      filter,
      ...params
    }
    return this.fetch("/v1/trending-tags/illust", {params})
  }

  public searchIllust(word: string, params?: PixivParams): Promise<B extends true ? PixivIllustSearch : Pixiv_Illust_Search> {
    if (!word) {
      return Promise.reject(new Error("Word required"))
    }
    params = {
      word,
      searchTarget: "partial_match_for_tags",
      sort: "date_desc",
      filter,
      ...params
    }
    return this.fetch("/v1/search/illust", {params})
  }

  public searchNovel(word: string, params?: PixivParams): Promise<B extends true ? PixivNovelSearch : Pixiv_Novel_Search> {
    if (!word) {
      return Promise.reject(new Error("Word required"))
    }
    params = {
      word,
      searchTarget: "partial_match_for_tags",
      sort: "date_desc",
      filter,
      ...params
    }
    return this.fetch("/v1/search/novel", {params})
  }

  public searchUser(word: string, params?: PixivParams): Promise<B extends true ? PixivUserSearch : Pixiv_User_Search> {
    if (!word) {
      return Promise.reject(new Error("Word required"))
    }
    params = {
      word,
      filter,
      ...params
    }
    return this.fetch("/v1/search/user", {params})
  }

  public searchAutoComplete(word: string): Promise<B extends true ? PixivAutoComplete : Pixiv_Auto_Complete> {
    if (!word) {
      return Promise.reject(new Error("word required"))
    }
    return this.fetch("/v1/search/autocomplete", {params: {word}})
  }

  public illustBookmarkDetail(id: number, params?: PixivParams): Promise<B extends true ? PixivBookmarkDetail : Pixiv_Bookmark_Detail> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      ...params
    }
    return this.fetch("/v2/illust/bookmark/detail", {params})
  }

  // This endpoint doesn't exist
  public illustBookmarkAdd(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      restrict: "public",
      ...params
    }

    return this.fetch("/v2/illust/bookmark/add", {params})
  }

  // This endpoint doesn't exist
  public illustBookmarkDelete(id: number, params?: PixivParams): Promise<unknown> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      ...params
    }
    return this.fetch("/v1/illust/bookmark/delete", {params})
  }

  public userBookmarkTagsIllust(params?: PixivParams): Promise<B extends true ? PixivBookmarkSearch : Pixiv_Bookmark_Search> {
    params = {
      restrict: "public",
      ...params
    }
    return this.fetch("/v1/user/bookmark-tags/illust", {params})
  }

  public novelRecommended(params?: PixivParams): Promise<B extends true ? PixivNovelSearch : Pixiv_Novel_Search> {
    params = {
      includeRankingNovels: true,
      filter,
      ...params
    }
    return this.fetch("/v1/novel/recommended", {params})
  }

  // This endpoint doesn't exist
  public mangaNew(params?: PixivParams) {
    params = {
      contentType: "manga",
      filter,
      ...params
    }
    return this.fetch("/v1/manga/new", {params})
  }

  public mangaRecommended(params?: PixivParams): Promise<B extends true ? PixivMangaSearch : Pixiv_Manga_Search> {
    params = {
      includeRankingLabel: true,
      filter,
      ...params
    }
    return this.fetch("/v1/manga/recommended", {params})
  }

  public novelRecommendedNologin(params?: PixivParams): Promise<B extends true ? PixivNovelSearch : Pixiv_Novel_Search> {
    params = {
      includeRankingNovels: true,
      filter,
      ...params
    }

    return this.fetch("/v1/novel/recommended-nologin", {params})
  }

  public novelNew(params?: PixivParams): Promise<B extends true ? PixivNovelSearch : Pixiv_Novel_Search> {
    params = {
      filter,
      ...params
    }
    return this.fetch("/v1/novel/new", {params})
  }

  public ugoiraMetaData(id: number, params?: PixivParams): Promise<B extends true ? UgoiraMetaData : Ugoira_Meta_Data> {
    if (!id) {
      return Promise.reject(new Error("illustId required"))
    }
    params = {
      illustId: id,
      filter,
      ...params
    }
    return this.fetch("/v1/ugoira/metadata", {params})
  }

  public async fetch(target: string, options?: PixivFetchOptions): Promise<any> {
    if (!target) {
      return Promise.reject(new Error("url required"))
    }

    try {
      return this._get(target, options)
    } catch (error) {
      if (this.once) {
        this.once = false
        throw error
      }
      await this.login()
      this.once = true
      return this._get(target, options)
    }
  }

  private async _get(target: string, options: PixivFetchOptions = {}): Promise<any> {
    options = options || {}

    if (options.data) {
      options.method = "post"
      options.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      }
      options.data = stringify(decamelizeKeys(options.data))
    }

    if (options.params) {
      options.params = decamelizeKeys(options.params)
    }
    const {data} = await instance(target, options as AxiosRequestConfig)
    this.nextUrl = data && data.next_url ? data.next_url : null
    return this.camelcaseKeys ? camelcaseKeys(data, {deep: true}) : data
  }
}

module.exports.default = PixivApp
module.exports = PixivApp
