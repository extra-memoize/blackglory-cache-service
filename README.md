# @extra-memoize/blackglory-cache-service
## Install
```sh
npm install --save @extra-memoize/blackglory-cache-service
# or
yarn add @extra-memoize/blackglory-cache-service
```

## API
### AsyncCacheService
```ts
class AsyncCacheService<T> implements IAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive?: number | null = null
    }
  )
}
```

### StaleWhileRevalidateAsyncCacheService
```ts
class StaleWhileRevalidateAsyncCacheService<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive: number
      staleWhileRevalidate: number
    }
  )
}
```

### StaleIfErrorAsyncCacheService
```ts
class StaleIfErrorAsyncCacheService<T> implements IStaleIfErrorAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive: number
      staleIfError: number
    }
  )
}
```

### StaleWhileRevalidateAndStaleIfErrorAsyncCacheService
```ts
class StaleWhileRevalidateAndStaleIfErrorAsyncCacheService<T> implements IStaleWhileRevalidateAndStaleIfErrorAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , options: {
      toJSONValue: (value: T) => JSONValue
      fromJSONValue: (json: JSONValue) => T

      timeToLive: number
      staleWhileRevalidate: number
      staleIfError: number
    }
  )
}
```
