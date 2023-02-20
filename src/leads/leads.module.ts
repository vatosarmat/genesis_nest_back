import { Module } from '@nestjs/common'
import { LeadsService } from './leads.service'
import { LeadsController } from './leads.controller'
import { AmoModule } from '../amo/amo.module'

@Module({
  imports: [AmoModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
