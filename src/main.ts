import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { useRequestLogging } from './logging'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })
  app.enableCors({
    origin: /^https?:\/\/(?:localhost|127\.0\.0\.1)/,
  })
  useRequestLogging(app)

  if (process.env.GLOBAL_PREFIX) {
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX)
  }

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
