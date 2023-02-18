import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  if (process.env.GLOBAL_PREFIX) {
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX)
  }

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
