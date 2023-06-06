/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

export interface GetVideosResponse {
  kind?: string
  etag?: string
  nextPageToken?: string
  regionCode?: string
  pageInfo?: PageInfo
  items?: VideoItem[]
}

export interface VideoItem {
  kind?: string
  etag?: string
  id?: VideoId
  snippet?: VideoSnippet
}

export interface VideoId {
  kind?: string
  videoId?: string
}

export interface PageInfo {
  totalResults?: number
  resultsPerPage?: number
}

export interface VideoSnippet {
  publishedAt?: Date
  channelId?: string
  title?: string
  description?: string
  thumbnails?: VideoThumbnails
  channelTitle?: string
  liveBroadcastContent?: string
  publishTime?: Date
}

export interface VideoThumbnails {
  default?: VideoThumbnail
  medium?: VideoThumbnail
  high?: VideoThumbnail
}

export interface VideoThumbnail {
  url?: string
  width?: number
  height?: number
}
