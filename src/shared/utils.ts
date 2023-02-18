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
