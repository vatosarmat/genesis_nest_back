import { Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'

import { randomError } from '../shared/utils'

@Injectable()
export class CompaniesService {
  private idCounter = 1
  create(createCompanyDto: CreateCompanyDto) {
    randomError()
    return {
      id: this.idCounter++,
      name: createCompanyDto.name,
      created_at: Date.now(),
    }
  }
}
