import { Injectable } from '@nestjs/common'
import { CreateContactDto } from './dto/create-contact.dto'

import { randomError } from '../shared/utils'

@Injectable()
export class ContactsService {
  private idCounter = 1
  create(createContactDto: CreateContactDto) {
    randomError()
    return {
      id: this.idCounter++,
      name: createContactDto.name,
      created_at: Date.now(),
    }
  }
}
