import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { get as getProp } from 'lodash'

import { CreateLeadDto } from '../leads/dto/create-lead.dto'
import { CreateContactDto } from '../contacts/dto/create-contact.dto'
import { CreateCompanyDto } from '../companies/dto/create-company.dto'

import { isObject } from '../utils'

type TokenData = {
  base_domain: string
  access_token: string
}

type Entity = {
  id: number
  name: string
  created_at: number
}

function isExpectedTokenData(arg: unknown): arg is TokenData {
  return (
    isObject(arg) &&
    typeof arg.base_domain === 'string' &&
    arg.base_domain !== '' &&
    typeof arg.access_token === 'string' &&
    arg.access_token !== ''
  )
}

function isExpectedEntity(arg: unknown): arg is Entity {
  return (
    isObject(arg) &&
    typeof arg.id === 'number' &&
    (!arg.created_at || typeof arg.created_at === 'number') &&
    (!arg.name || typeof arg.name === 'string')
  )
}

class AmoError extends Error {
  constructor(message: string, private data?: unknown) {
    super(message)
  }
}

@Injectable()
export class AmoService {
  private amoApiPrefx = 'api/v4'
  private clientId = this.configService.getOrThrow<string>('CLIENT_ID')
  private tokenUrl = this.configService.getOrThrow<string>('TOKEN_URL')

  private amoCreds: TokenData | undefined = undefined

  constructor(private configService: ConfigService, private httpService: HttpService) {}

  private async fetchAmoCreds(): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.get<unknown>(this.tokenUrl, {
        headers: { 'X-Client-Id': this.clientId },
      })
    )
    if (isExpectedTokenData(response.data)) {
      this.amoCreds = response.data
    } else {
      throw new AmoError('Unexpected token format', response.data)
    }
  }

  private async ensureAmoCreds(): Promise<TokenData> {
    if (!this.amoCreds) {
      await this.fetchAmoCreds()
    }
    return this.amoCreds!
  }

  private async amoGetEntity(entity: string, id: number): Promise<Entity> {
    const { base_domain, access_token } = await this.ensureAmoCreds()
    const response = await firstValueFrom(
      this.httpService.get<unknown>(
        `https://${base_domain}/${this.amoApiPrefx}/${entity}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
    )
    if (isExpectedEntity(response.data)) {
      return response.data
    }
    throw new AmoError('Unexpected entity format', response.data)
  }

  private async amoPostEntity(entity: string, body: object): Promise<number> {
    const { base_domain, access_token } = await this.ensureAmoCreds()
    const response = await firstValueFrom(
      this.httpService.post<unknown>(
        `https://${base_domain}/${this.amoApiPrefx}/${entity}`,
        [body],
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    )
    const id = getProp(response.data, `_embedded.${entity}[0].id`) as unknown
    if (id && typeof id === 'number' && Number.isInteger(id)) {
      return id
    }

    throw new AmoError('Unexpected creation result format', response.data)
  }

  async createLead(createLeadDto: CreateLeadDto) {
    const leadId = await this.amoPostEntity('leads', createLeadDto)
    return this.amoGetEntity('leads', leadId)
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const companyId = await this.amoPostEntity('companies', createCompanyDto)
    return this.amoGetEntity('companies', companyId)
  }

  async createContact(createContactDto: CreateContactDto) {
    const contactId = await this.amoPostEntity('contacts', createContactDto)
    return this.amoGetEntity('contacts', contactId)
  }

  async fildLead(leadId: number) {
    return this.amoGetEntity('leads', leadId)
  }

  async fildCompany(companyId: number) {
    return this.amoGetEntity('companies', companyId)
  }

  async fildContact(contactId: number) {
    return this.amoGetEntity('contacts', contactId)
  }
}
