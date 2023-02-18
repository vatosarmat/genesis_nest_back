import { Injectable } from '@nestjs/common'
import { CreateLeadDto } from './dto/create-lead.dto'

import { randomError } from '../shared/utils'

@Injectable()
export class LeadsService {
  private idCounter = 1
  create(createLeadDto: CreateLeadDto) {
    randomError()
    return {
      id: this.idCounter++,
      name: createLeadDto.name,
      created_at: Date.now(),
    }
  }
}
