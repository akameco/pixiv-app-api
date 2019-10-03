export interface PixivClient {
  accessToken: string
  expiresIn: number
  tokenType: string
  scope: string
  refreshToken: string
  user: PixivClientUser
  deviceToken: string
}
export interface PixivClientUser {
  profileImageUrls: {
    px16X16: string
    px50X50: string
    px170X170: string
  }
  id: string
  name: string
  account: string
  mailAddress: string
  isPremium: boolean
  xRestrict: number
  isMailAuthorized: boolean
}
export interface PixivRequestData {
  clientId: string
  clientSecret: string
  getSecureUrl: string
  grantType: string
  refreshToken: string
  username: string
  password: string
}
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
}
export interface PixivFetchOptions {
  data?: string
  method?: string
  headers?: {
    [header: string]: string
  }
  params?: PixivParams
}
export interface PixivUser {
  id: number
  name: string
  account: string
  profileImageUrls: {
    medium: string
  }
  comment: string
  isFollowed: boolean
}
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
export interface PixivIllustSearch {
  illusts: PixivIllust[]
  nextUrl: string | null
  searchSpanLimit?: number
}
export interface PixivUserSearch {
  userPreviews: {
    user: PixivUser
    illusts: PixivIllust[]
    novels: PixivNovel[]
    isMuted: boolean
  }[]
  nextUrl: string | null
}
export interface PixivCommentSearch {
  totalComments: number
  comments: PixivComment[]
  nextUrl: string | null
}
export interface PixivNovelSearch {
  novels: PixivNovel[]
  nextUrl: string | null
  privacyPolicy?: {}
  searchSpanLimit?: number
}
export interface PixivBookmarkSearch {
  bookmarkTags: PixivTag[]
  nextUrl: string | null
}
export interface PixivMangaSearch {
  illusts: PixivManga[]
  rankingIllusts: PixivManga[] | []
  privacyPolicy: {}
  nextUrl: string | null
}
export interface PixivIllust {
  id: number
  title: string
  type: string
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
export interface PixivTag {
  name: string
  translatedName: string | null
  addedByUploadedUser?: boolean
  illust?: PixivIllust
  isRegistered?: boolean
}
export interface PixivMetaPage {
  imageUrls: {
    squareMedium: string
    medium: string
    large: string
    original: string
  }
}
export interface PixivComment {
  id: number
  comment: string
  date: string
  user: PixivUser
  parentComment: PixivComment | {}
}
export interface PixivNovel {
  id: number
  title: string
  caption: string
  restrict: number
  xRestrict: number
  imageUrls: {
    squareMedium: string
    medium: string
    large?: string
  }
  createDate: string
  tags: PixivTag[]
  pageCount: number
  textLength: number
  user: PixivUser
  series:
    | {
        id: number
        title: string
      }
    | {}
  isBookmarked: boolean
  totalBookmarks: number
  totalView: number
  visible: boolean
  totalComments: number
  isMuted: boolean
  isMypixivOnly: boolean
  isXRestricted: boolean
}
export interface PixivManga {
  id: number
  title: string
  type: string
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
  pageCount: string
  width: number
  height: number
  sanityLevel: number
  xRestrict: number
  series: {
    id: number
    title: string
  } | null
  metaSinglePage: {}
  metaPages: PixivMetaPage[]
  totalView: number
  totalBookmarks: number
  isBookmarked: boolean
  visible: boolean
  isMuted: boolean
}
export interface PixivTrendTags {
  trend_tags: PixivTag[]
}
export interface PixivAutoComplete {
  searchAutoCompleteKeywords: string[]
}
export interface PixivBookmarkDetail {
  isBookmarked: boolean
  tags: PixivTag[]
  restrict: string
}
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
//# sourceMappingURL=PixivTypes.d.ts.map
