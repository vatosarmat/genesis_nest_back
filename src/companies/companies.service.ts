import { Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'

import { AmoService } from '../amo/amo.service'

@Injectable()
export class CompaniesService {
  constructor(private amoService: AmoService) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.amoService.createCompany(createCompanyDto)
  }
}
