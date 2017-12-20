'use strict'
const url = require('url')
const { stringify } = require('querystring')
const axios = require('axios')
const camelcaseKeys = require('camelcase-keys')
const decamelizeKeys = require('decamelize-keys')

const baseURL = 'https://app-api.pixiv.net/'
const instance = axios.create({
  baseURL,
  headers: {
    'App-OS': 'ios',
    'App-OS-Version': '9.3.3',
    'App-Version': '6.0.9'
  }
})

const CLIENT_ID = 'KzEZED7aC0vird8jWyHM38mXjNTY'
const CLIENT_SECRET = 'W9JZoJe00qPvJsiyCGT3CCtC6ZUtdpKpzMbNlUGP'
const filter = 'for_ios'

class PixivApp {
  constructor(username, password, opts) {
    this.username = username
    this.password = password
    this.refreshToken = ''
    opts = opts || { camelcaseKeys: true }
    if (opts.camelcaseKeys) {
      this.camelcaseKeys = true
    }
  }

  login(username, password) {
    this.username = username || this.username
    this.password = password || this.password

    if (typeof this.username !== 'string') {
      return Promise.reject(
        new TypeError(`Expected a string, got ${typeof this.username}`)
      )
    }

    if (typeof this.password !== 'string') {
      return Promise.reject(
        new TypeError(`Expected a string, got ${typeof this.password}`)
      )
    }

    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      get_secure_url: 1
    }

    if (this.refreshToken === '') {
      data.grant_type = 'password'
      data.username = this.username
      data.password = this.password
    } else {
      data.grant_type = 'refresh_token'
      data.refresh_token = this.refreshToken
    }
    return axios
      .post('https://oauth.secure.pixiv.net/auth/token', stringify(data))
      .then(res => {
        const { response } = res.data
        this.auth = response
        this.refreshToken = res.data.response.refresh_token
        instance.defaults.headers.common.Authorization = `Bearer ${
          response.access_token
        }`
        return response
      })
  }

  authInfo() {
    return this.auth
  }

  hasNext() {
    return Boolean(this.nextUrl)
  }

  next() {
    return this.fetch(this.nextUrl)
  }

  nextQuery() {
    return url.parse(this.nextUrl, true).params
  }

  userDetail(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id,
        filter
      },
      params
    )
    return this.fetch('/v1/user/detail', { params })
  }

  userIllusts(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }

    params = Object.assign(
      {
        user_id: id,
        type: 'illust',
        filter
      },
      params
    )
    return this.fetch('/v1/user/illusts', { params })
  }

  userFollowAdd(id, data) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    data = Object.assign(
      {
        user_id: id,
        restrict: 'public',
        filter
      },
      data
    )
    return this.fetch('/v1/user/follow/add', { data })
  }

  userFollowDelete(id, data) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    data = Object.assign(
      {
        user_id: id,
        restrict: 'public',
        filter
      },
      data
    )
    return this.fetch('/v1/user/follow/delete', { data })
  }

  userBookmarksIllust(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id,
        restrict: 'public',
        filter
      },
      params
    )
    return this.fetch('/v1/user/bookmarks/illust', { params })
  }

  userFollowing(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id,
        restrict: 'public'
      },
      params
    )
    return this.fetch('/v1/user/following', { params })
  }

  userFollower(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id
      },
      params
    )
    return this.fetch('/v1/user/follower', { params })
  }

  userMypixiv(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id
      },
      params
    )
    return this.fetch('/v1/user/mypixiv', { params })
  }

  userList(id, params) {
    if (!id) {
      return Promise.reject(new Error('user_id required'))
    }
    params = Object.assign(
      {
        user_id: id,
        filter
      },
      params
    )
    return this.fetch('/v1/user/list', { params })
  }

  illustDetail(id, params) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    params = Object.assign(
      {
        illust_id: id,
        filter
      },
      params
    )
    return this.fetch('/v1/illust/detail', { params })
  }

  illustNew(params) {
    params = Object.assign(
      {
        content_type: 'illust',
        filter
      },
      params
    )
    return this.fetch('/v1/illust/new', { params })
  }

  illustFollow(params) {
    params = Object.assign(
      {
        restrict: 'public'
      },
      params
    )
    return this.fetch('/v2/illust/follow', { params })
  }

  illustComments(id, params) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    params = Object.assign(
      {
        illust_id: id,
        include_total_comments: 'true'
      },
      params
    )
    return this.fetch('/v1/illust/comments', { params })
  }

  illustRelated(id, params) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    params = Object.assign(
      {
        illust_id: id,
        filter
      },
      params
    )
    return this.fetch('/v2/illust/related', { params })
  }

  illustRecommended(params) {
    params = Object.assign(
      {
        content_type: 'illust',
        include_ranking_label: 'true',
        filter
      },
      params
    )
    return this.fetch('/v1/illust/recommended', { params })
  }

  illustRecommendedNologin(params) {
    params = Object.assign(
      {
        include_ranking_illusts: true,
        filter
      },
      params
    )
    return this.fetch('/v1/illust/recommended-nologin', { params })
  }

  illustRanking(params) {
    params = Object.assign(
      {
        mode: 'day',
        filter
      },
      params
    )
    return this.fetch('/v1/illust/ranking', { params })
  }

  trendingTagsIllust(params) {
    params = Object.assign(
      {
        filter
      },
      params
    )
    return this.fetch('/v1/trending-tags/illust', { params })
  }

  searchIllust(word, params) {
    if (!word) {
      return Promise.reject(new Error('word required'))
    }
    params = Object.assign(
      {
        word,
        search_target: 'partial_match_for_tags',
        sort: 'date_desc',
        filter
      },
      params
    )
    return this.fetch('/v1/search/illust', { params })
  }

  searchNovel(word, params) {
    if (!word) {
      return Promise.reject(new Error('word required'))
    }
    params = Object.assign(
      {
        word,
        search_target: 'partial_match_for_tags',
        sort: 'date_desc',
        filter
      },
      params
    )
    return this.fetch('/v1/search/novel', { params })
  }

  searchUser(word, params) {
    if (!word) {
      return Promise.reject(new Error('word required'))
    }
    params = Object.assign(
      {
        word,
        filter
      },
      params
    )
    return this.fetch('/v1/search/user', { params })
  }

  searchAutoComplete(word) {
    if (!word) {
      return Promise.reject(new Error('word required'))
    }
    return this.fetch('/v1/search/autocomplete', { params: { word } })
  }

  illustBookmarkDetail(id, params) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    params = Object.assign(
      {
        illust_id: id
      },
      params
    )
    return this.fetch('/v2/illust/bookmark/detail', { params })
  }

  illustBookmarkAdd(id, data) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    data = Object.assign(
      {
        illust_id: id,
        restrict: 'public'
      },
      data
    )
    return this.fetch('/v2/illust/bookmark/add', { data })
  }

  illustBookmarkDelete(id, data) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'))
    }
    data = Object.assign(
      {
        illust_id: id
      },
      data
    )
    return this.fetch('/v1/illust/bookmark/delete', { data })
  }

  userBookmarkTagsIllust(params) {
    params = Object.assign(
      {
        restrict: 'public'
      },
      params
    )
    return this.fetch('/v1/user/bookmark-tags/illust', { params })
  }

  novelRecommended(params) {
    params = Object.assign(
      {
        include_ranking_novels: true,
        filter
      },
      params
    )
    return this.fetch('/v1/novel/recommended', { params })
  }

  mangaNew(params) {
    params = Object.assign(
      {
        content_type: 'manga',
        filter
      },
      params
    )
    return this.fetch('/v1/manga/new', { params })
  }

  mangaRecommended(params) {
    params = Object.assign(
      {
        include_ranking_label: true,
        filter
      },
      params
    )
    return this.fetch('/v1/manga/recommended', { params })
  }

  novelRecommendedNologin(params) {
    params = Object.assign(
      {
        include_ranking_novels: true,
        filter
      },
      params
    )
    return this.fetch('/v1/novel/recommended-nologin', { params })
  }

  novelNew(params) {
    return this.fetch('/v1/novel/new', { params })
  }

  fetch(target, opts) {
    if (!target) {
      return Promise.reject(new Error('url required'))
    }

    return this._got(target, opts).catch(err => {
      if (this.once) {
        this.once = false
        throw err
      }

      return this.login().then(() => {
        this.once = true
        return this._got(target, opts)
      })
    })
  }

  _got(target, opts) {
    opts = opts || {}

    if (opts.data) {
      opts.method = 'post'
      opts.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      opts.data = stringify(decamelizeKeys(opts.data))
    }

    if (opts.params) {
      opts.params = decamelizeKeys(opts.params)
    }

    return instance(target, opts).then(res => {
      const { data } = res
      this.nextUrl = data && data.next_url ? data.next_url : null
      return this.camelcaseKeys ? camelcaseKeys(data, { deep: true }) : data
    })
  }
}

module.exports = PixivApp
