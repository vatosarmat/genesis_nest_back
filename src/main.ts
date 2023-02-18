import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { useRequestLogging } from 'src/shared/logging'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })
  useRequestLogging(app)

  if (process.env.GLOBAL_PREFIX) {
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX)
  }

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
