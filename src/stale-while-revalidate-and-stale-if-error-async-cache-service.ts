import { IStaleWhileRevalidateAndStaleIfErrorAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull } from '@blackglory/prelude'
import { defaultFromString, defaultToString } from './utils'

export class StaleWhileRevalidateAndStaleIfErrorAsyncCacheService<T> implements IStaleWhileRevalidateAndStaleIfErrorAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private staleIfError: number
  , private toString: (value: T) => string = defaultToString
  , private fromString: (text: string) => T = defaultFromString
  ) {}

  async get(key: string): Promise<
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate | State.StaleIfError, T]
  > {
    const item = await this.client.getWithMetadata(this.namespace, key)
    if (isNull(item)) {
      return [State.Miss]
    } else {
      const elapsed = Date.now() - item.metadata.updatedAt
      if (elapsed <= this.timeToLive) {
        return [State.Hit, this.fromString(item.value)]
      } else if (elapsed <= this.timeToLive + this.staleWhileRevalidate) {
        return [State.StaleWhileRevalidate, this.fromString(item.value)]
      } else if (elapsed <= this.timeToLive + this.staleWhileRevalidate + this.staleIfError) {
        return [State.StaleIfError, this.fromString(item.value)]
      } else {
        // just in case
        return [State.Miss]
      }
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.set(
      this.namespace
    , key
    , this.toString(value)
    , this.timeToLive
    , this.staleWhileRevalidate + this.staleIfError
    )
  }
}
