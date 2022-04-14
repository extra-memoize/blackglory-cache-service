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
  , toString: (value: T) => string = defaultToString
  , fromString: (text: string) => T = defaultFromString
  )
}
```

### StaleWhileRevalidateAsyncCacheService
```ts
class StaleWhileRevalidateAsyncCacheService<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , timeToLive: number
  , staleWhileRevalidate: number
  , toString: (value: T) => string = defaultToString
  , fromString: (text: string) => T = defaultFromString
  )
}
```

### StaleIfErrorAsyncCacheService
```ts
class StaleIfErrorAsyncCacheService<T> implements IStaleIfErrorAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , timeToLive: number
  , staleIfError: number
  , toString: (value: T) => string = defaultToString
  , fromString: (text: string) => T = defaultFromString
  )
}
```

### StaleWhileRevalidateAndStaleIfErrorAsyncCacheService
```ts
class StaleWhileRevalidateAndStaleIfErrorAsyncCacheService<T> implements IStaleWhileRevalidateAndStaleIfErrorAsyncCache<T> {
  constructor(
    client: CacheClient
  , namespace: string
  , timeToLive: number
  , staleWhileRevalidate: number
  , staleIfError: number
  , toString: (value: T) => string = defaultToString
  , fromString: (text: string) => T = defaultFromString
  )
}
```
