import { IStaleWhileRevalidateAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull, JSONValue } from '@blackglory/prelude'

export class StaleWhileRevalidateAsyncCacheService<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive: number
      staleWhileRevalidate: number
    }
  ) {}

  async get(key: string): Promise<
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate, T]
  > {
    const item = await this.client.getItem(this.namespace, key)
    if (isNull(item)) {
      return [State.Miss]
    } else {
      const timestamp = Date.now()
      if (
        item.metadata.updatedAt
      + this.options.timeToLive
      > timestamp
      ) {
        return [State.Hit, this.options.fromJSONValue(item.value)]
      } else if (
        item.metadata.updatedAt
      + this.options.timeToLive
      + this.options.staleWhileRevalidate
      > timestamp
      ) {
        return [State.StaleWhileRevalidate, this.options.fromJSONValue(item.value)]
      } else {
        return [State.Miss]
      }
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.setItem(
      this.namespace
    , key
    , this.options.toJSONValue(value)
    , this.options.timeToLive + this.options.staleWhileRevalidate
    )
  }
}
