export interface Pixiv_Client {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
  user: Pixiv_Client_User
  device_token: string
}
export interface Pixiv_Client_User {
  profile_image_urls: {
    px_16x16: string
    px_50x50: string
    px_170x170: string
  }
  id: string
  name: string
  account: string
  mail_address: string
  is_premium: boolean
  x_restrict: number
  is_mail_authorized: boolean
}
export interface Pixiv_Request_Data {
  client_id: string
  client_secret: string
  get_secure_url: string
  grant_type: string
  refresh_token: string
  username: string
  password: string
}
export interface Pixiv_User {
  id: number
  name: string
  account: string
  profile_image_urls: {
    medium: string
  }
  comment: string
  is_followed: boolean
}
export interface Pixiv_User_Detail {
  user: Pixiv_User
  profile: {
    webpage: string
    gender: string
    birth: string
    birth_day: string
    birth_year: number
    region: string
    address_id: number
    country_code: string
    job: string
    job_id: number
    total_follow_users: number
    total_mypixiv_users: number
    total_illusts: number
    total_manga: number
    total_novels: number
    total_illust_bookmarks_public: number
    total_illust_series: number
    background_image_url: string
    twitter_account: string
    twitter_url: string
    pawoo_url: string
    is_premium: boolean
    is_using_custom_profile_image: boolean
  }
  profile_publicity: {
    gender: string
    region: string
    birth_day: string
    birth_year: string
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
    workspace_image_url: string | null
  }
}
export interface Pixiv_Illust_Search {
  illusts: Pixiv_Illust[]
  next_url: string | null
  search_span_limit?: number
}
export interface Pixiv_User_Search {
  user_previews: {
    user: Pixiv_User
    illusts: Pixiv_Illust[]
    novels: Pixiv_Novel[]
    is_muted: boolean
  }[]
  next_url: string | null
}
export interface Pixiv_Comment_Search {
  total_comments: number
  comments: Pixiv_Comment[]
  next_url: string | null
}
export interface Pixiv_Novel_Search {
  novels: Pixiv_Novel[]
  next_url: string | null
  privacy_policy?: {}
  search_span_limit?: number
}
export interface Pixiv_Bookmark_Search {
  bookmark_tags: Pixiv_Tag[]
  next_url: string | null
}
export interface Pixiv_Manga_Search {
  illusts: Pixiv_Manga[]
  ranking_illusts: Pixiv_Manga[] | []
  privacy_policy: {}
  next_url: string | null
}
export interface Pixiv_Illust {
  id: number
  title: string
  type: string
  image_urls: {
    square_medium: string
    medium: string
    large?: string
  }
  caption: string
  restrict: number
  user: Pixiv_User
  tags: Pixiv_Tag[]
  tools: string[]
  create_date: string
  page_count: number
  width: number
  height: number
  sanity_level: number
  meta_single_page: {
    original_image_url?: string
  }
  meta_pages: Pixiv_Meta_Page[]
  total_view: number
  total_bookmarks: number
  is_bookmarked: boolean
  visible: boolean
  is_muted: boolean
  total_comments: number
}
export interface Pixiv_Tag {
  name: string
  translated_name: string | null
  added_by_uploaded_user?: boolean
  illust?: Pixiv_Illust
  is_registered?: boolean
}
export interface Pixiv_Meta_Page {
  image_urls: {
    square_medium: string
    medium: string
    large: string
    original: string
  }
}
export interface Pixiv_Comment {
  id: number
  comment: string
  date: string
  user: Pixiv_User
  parent_comment: Pixiv_Comment | {}
}
export interface Pixiv_Novel {
  id: number
  title: string
  caption: string
  restrict: number
  x_restrict: number
  image_urls: {
    square_medium: string
    medium: string
    large?: string
  }
  create_date: string
  tags: Pixiv_Tag[]
  page_count: number
  text_length: number
  user: Pixiv_User
  series:
    | {
        id: number
        title: string
      }
    | {}
  is_bookmarked: boolean
  total_bookmarks: number
  total_view: number
  visible: boolean
  total_comments: number
  is_muted: boolean
  is_mypixiv_only: boolean
  is_x_restricted: boolean
}
export interface Pixiv_Manga {
  id: number
  title: string
  type: string
  image_urls: {
    square_medium: string
    medium: string
    large?: string
  }
  caption: string
  restrict: number
  user: Pixiv_User
  tags: Pixiv_Tag[]
  tools: string[]
  create_date: string
  page_count: string
  width: number
  height: number
  sanity_level: number
  x_restrict: number
  series: {
    id: number
    title: string
  } | null
  meta_single_page: {}
  meta_pages: Pixiv_Meta_Page[]
  total_view: number
  total_bookmarks: number
  is_bookmarked: boolean
  visible: boolean
  is_muted: boolean
}
export interface Pixiv_Trend_Tags {
  trend_tags: Pixiv_Tag[]
}
export interface Pixiv_Auto_Complete {
  search_auto_complete_keywords: string[]
}
export interface Pixiv_Bookmark_Detail {
  is_bookmarked: boolean
  tags: Pixiv_Tag[]
  restrict: string
}
export interface Ugoira_Meta_Data {
  ugoira_metadata: {
    zip_urls: {
      medium: string
    }
    frames: {
      file: string
      delay: number
    }[]
  }
}
