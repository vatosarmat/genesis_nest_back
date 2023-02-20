import { HttpException } from '@nestjs/common'

export const randomError = () => {
  const random = Math.random()
  if (random > 0.8) {
    throw new HttpException('Server is broken!', 500)
  }
  if (random > 0.6) {
    throw new HttpException('You are not allowed!', 401)
  }
}

export function isKeyOfObject<T extends object>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj
}

export function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}
