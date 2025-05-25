import { IStaleWhileRevalidateAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull } from '@blackglory/prelude'
import { defaultFromString, defaultToString } from './utils.js'

export class StaleWhileRevalidateAsyncCacheService<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private toString: (value: T) => string = defaultToString
  , private fromString: (text: string) => T = defaultFromString
  ) {}

  async get(key: string): Promise<
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate, T]
  > {
    const item = await this.client.getItemWithMetadata(this.namespace, key)
    if (isNull(item)) {
      return [State.Miss]
    } else {
      if (this.isStaleWhileRevalidate(item.metadata.updatedAt)) {
        return [State.StaleWhileRevalidate, this.fromString(item.value)]
      } else {
        return [State.Hit, this.fromString(item.value)]
      }
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.setItem(
      this.namespace
    , key
    , this.toString(value)
    , this.timeToLive + this.staleWhileRevalidate
    )
  }

  private isStaleWhileRevalidate(updatedAt: number): boolean {
    const timestamp = Date.now()
    return updatedAt + this.timeToLive <= timestamp
        && updatedAt + this.timeToLive + this.staleWhileRevalidate > timestamp
  }
}
