import { IAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull } from '@blackglory/prelude'
import { defaultFromString, defaultToString } from './utils.js'

export class AsyncCacheService<T> implements IAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private timeToLive: number | null = null
  , private toString: (value: T) => string = defaultToString
  , private fromString: (text: string) => T = defaultFromString
  ) {}

  async get(key: string): Promise<[State.Miss] | [State.Hit, T]> {
    const value = await this.client.getItem(this.namespace, key)
    if (isNull(value)) {
      return [State.Miss]
    } else {
      return [State.Hit, this.fromString(value)]
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.setItem(
      this.namespace
    , key
    , this.toString(value)
    , this.timeToLive
    )
  }
}
