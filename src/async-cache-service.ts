import { IAsyncCache, State } from 'extra-memoize'
import { CacheClient } from '@blackglory/cache-js'
import { isNull, JSONValue } from '@blackglory/prelude'

export class AsyncCacheService<T> implements IAsyncCache<T> {
  constructor(
    private client: CacheClient
  , private namespace: string
  , private options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive?: number | null
    }
  ) {}

  async get(key: string): Promise<[State.Miss] | [State.Hit, T]> {
    const value = await this.client.getItemValue(this.namespace, key)
    if (isNull(value)) {
      return [State.Miss]
    } else {
      return [State.Hit, this.options.fromJSONValue(value)]
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.client.setItem(
      this.namespace
    , key
    , this.options.toJSONValue(value)
    , this.options.timeToLive ?? null
    )
  }
}
