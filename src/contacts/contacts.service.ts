import { Injectable } from '@nestjs/common'
import { CreateContactDto } from './dto/create-contact.dto'

import { AmoService } from '../amo/amo.service'

@Injectable()
export class ContactsService {
  constructor(private amoService: AmoService) {}

  create(createContactDto: CreateContactDto) {
    return this.amoService.createContact(createContactDto)
  }
}
