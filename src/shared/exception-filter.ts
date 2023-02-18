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
    /*
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
    */

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    console.log(exception)

    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let status
    let response
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      response = exception.getResponse()
      if (typeof response === 'string') {
        response = {
          statusCode: status,
          message: response,
        }
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      response = {
        statusCode: status,
        message: 'Internal server error',
      }
    }

    // const responseBody = {
    //   statusCode: httpStatus,
    //   timestamp: new Date().toISOString(),
    //   path: httpAdapter.getRequestUrl(ctx.getRequest()),
    // }

    httpAdapter.reply(ctx.getResponse(), response, status)
  }
}
