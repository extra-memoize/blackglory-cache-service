import { IStaleWhileRevalidateAsyncCache } from 'extra-memoize'
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

  async get(key: string): Promise<T | undefined> {
    const value = await this.client.get(this.namespace, key)
    if (isNull(value)) return undefined

    return this.fromString(value)
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.set(
      this.namespace
    , key
    , this.toString(value)
    , this.timeToLive
    , this.staleWhileRevalidate
    )
  }

  async isStaleWhileRevalidate(key: string): Promise<boolean> {
    const item = await this.client.getWithMetadata(this.namespace, key)
    if (isNull(item)) return false

    const elapsed = Date.now() - item.metadata.updatedAt
    return elapsed > this.timeToLive
        && elapsed < this.timeToLive + this.staleWhileRevalidate
  }
}
