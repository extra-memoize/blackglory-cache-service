import { IStaleWhileRevalidateAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull } from '@blackglory/prelude'
import { defaultFromString, defaultToString } from './utils'

export class StaleWhileRevalidateAsyncCacheService<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private toString: (value: T) => string = defaultToString
  , private fromString: (text: string) => T = defaultFromString
  ) {}

  async get(key: string): Promise<[State.Miss] | [State.Hit, T]> {
    const item = await this.client.getWithMetadata(this.namespace, key)
    if (isNull(item)) {
      return [State.Miss]
    } else {
      const elapsed = Date.now() - item.metadata.updatedAt
      if (elapsed > this.timeToLive && elapsed < this.timeToLive + this.staleWhileRevalidate) {
        return [State.Hit, this.fromString(item.value)]
      } else {
        return [State.Hit, this.fromString(item.value)]
      }
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.set(
      this.namespace
    , key
    , this.toString(value)
    , this.timeToLive + this.staleWhileRevalidate
    )
  }
}
