import { Injectable } from '@nestjs/common'
import { CreateLeadDto } from './dto/create-lead.dto'

import { AmoService } from '../amo/amo.service'

@Injectable()
export class LeadsService {
  constructor(private amoService: AmoService) {}

  create(createLeadDto: CreateLeadDto) {
    return this.amoService.createLead(createLeadDto)
  }
}
