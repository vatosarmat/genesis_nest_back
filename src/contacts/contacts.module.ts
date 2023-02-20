import { Module } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { ContactsController } from './contacts.controller'
import { AmoModule } from '../amo/amo.module'

@Module({
  imports: [AmoModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
