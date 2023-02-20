import { AxiosError } from 'axios'
import { HttpAdapterHost } from '@nestjs/core'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let statusCode: number
    let message: string
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const response = exception.getResponse()
      if (typeof response === 'string') {
        message = response
      } else {
        message = exception.message
      }
    } else if (exception instanceof AxiosError) {
      const response = exception.response
      if (response && response.data && response.data.status && response.data.detail) {
        statusCode = response.data.status
        message = response.data.detail
        console.log(response.data)
      } else {
        statusCode = exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        message = exception.message
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
    }

    httpAdapter.reply(ctx.getResponse(), { statusCode, message }, statusCode)
  }
}
