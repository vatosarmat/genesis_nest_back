import { APP_FILTER } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { ContactsModule } from './contacts/contacts.module'
import { LeadsModule } from './leads/leads.module'
import { CompaniesModule } from './companies/companies.module'
import { AllExceptionFilter } from './shared/exception-filter'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContactsModule,
    LeadsModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
