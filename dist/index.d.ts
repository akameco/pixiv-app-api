import {
  Pixiv_Client,
  Pixiv_Client_User,
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
export default class PixivApp<CamelcaseKeys extends boolean = true> {
  camelcaseKeys: CamelcaseKeys
  username: string | undefined
  password: string | undefined
  refreshToken: string
  nextUrl: string | null
  auth: PixivClient | null
  private _once
  constructor(
    username?: string,
    password?: string,
    options?: {
      camelcaseKeys?: CamelcaseKeys
    }
  )
  login(
    username?: string,
    password?: string
  ): Promise<CamelcaseKeys extends true ? PixivClient : Pixiv_Client>
  authInfo(): CamelcaseKeys extends true ? PixivClient : Pixiv_Client
  hasNext(): boolean
  next(): Promise<any>
  nextQuery(): any
  nextParams(): PixivParams
  makeIterable(resp: any): AsyncIterable<any>
  userDetail(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserDetail : Pixiv_User_Detail>
  userIllusts(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  userFollowAdd(userId: number, params?: PixivParams): Promise<unknown>
  userFollowDelete(userId: number, params?: PixivParams): Promise<unknown>
  userBookmarksIllust(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  userFollowing(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search>
  userFollower(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search>
  userMypixiv(
    userId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search>
  userList(userId: number, params?: PixivParams): Promise<unknown>
  illustDetail(
    illustId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivIllust : Pixiv_Illust>
  illustNew(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustFollow(
    userId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustComments(
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivCommentSearch : Pixiv_Comment_Search
  >
  illustRelated(
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustRecommended(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustRecommendedNologin(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustWalkthrough(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustRanking(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  illustPopularPreview(
    word: string,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  trendingTagsIllust(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivTrendTags : Pixiv_Trend_Tags>
  searchIllust(
    word: string,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivIllustSearch : Pixiv_Illust_Search
  >
  searchNovel(
    word: string,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search>
  searchUser(
    word: string,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivUserSearch : Pixiv_User_Search>
  searchAutoComplete(
    word: string
  ): Promise<
    CamelcaseKeys extends true ? PixivAutoComplete : Pixiv_Auto_Complete
  >
  illustBookmarkDetail(
    illustId: number,
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkDetail : Pixiv_Bookmark_Detail
  >
  illustBookmarkAdd(illustId: number, params?: PixivParams): Promise<unknown>
  illustBookmarkDelete(illustId: number, params?: PixivParams): Promise<unknown>
  userBookmarkTagsIllust(
    params?: PixivParams
  ): Promise<
    CamelcaseKeys extends true ? PixivBookmarkSearch : Pixiv_Bookmark_Search
  >
  novelRecommended(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search>
  mangaNew(params?: PixivParams): Promise<unknown>
  mangaRecommended(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivMangaSearch : Pixiv_Manga_Search>
  novelRecommendedNologin(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search>
  novelNew(
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? PixivNovelSearch : Pixiv_Novel_Search>
  ugoiraMetaData(
    illustId: number,
    params?: PixivParams
  ): Promise<CamelcaseKeys extends true ? UgoiraMetaData : Ugoira_Meta_Data>
  fetch(target: string, options?: PixivFetchOptions): Promise<any>
  private _get
}
export {
  Pixiv_Client,
  Pixiv_Client_User,
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
