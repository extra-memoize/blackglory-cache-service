export function defaultToString<T>(value: T): string {
  return JSON.stringify(value)
}

export function defaultFromString<T>(text: string): T {
  return JSON.parse(text.toString())
}
