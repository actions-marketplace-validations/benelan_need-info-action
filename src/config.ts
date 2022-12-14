import {load} from 'js-yaml'

export interface InfoItem {
  content: string[]
  response: string
  requireAll: boolean
}

export default class Config {
  requiredItems: InfoItem[]
  includedItems: InfoItem[]
  commentHeader: string
  commentFooter: string
  labelToAdd: string
  labelsToCheck: string[]
  caseSensitive: boolean
  excludeComments: boolean
  exemptUsers: string[]

  constructor(content: string) {
    const config = this.parseConfig(content)
    this.requiredItems = config.requiredItems
    this.labelToAdd = config.labelToAdd
    this.labelsToCheck = config.labelsToCheck
    this.commentFooter = config.commentFooter || ''
    this.commentHeader = config.commentHeader || ''
    this.caseSensitive = config.caseSensitive || false
    this.excludeComments = config.excludeComments || false
    this.exemptUsers = config.exemptUsers || []
    this.includedItems = config.includedItems || []
  }

  isValidRequiredItem = (item: InfoItem): item is InfoItem =>
    item !== null &&
    typeof item === 'object' &&
    'response' in item &&
    'requireAll' in item &&
    'content' in item &&
    typeof item.response === 'string' &&
    typeof item.requireAll === 'boolean' &&
    Array.isArray(item.content)
      ? item.content.every((i: string) => typeof i === 'string')
      : false

  isValidConfig(obj: Config): obj is Config {
    return obj !== null &&
      typeof obj === 'object' &&
      'requiredItems' in obj &&
      'labelToAdd' in obj &&
      'labelsToCheck' in obj &&
      typeof obj.labelToAdd === 'string' &&
      Array.isArray(obj.requiredItems) &&
      Array.isArray(obj.labelsToCheck)
      ? obj.requiredItems.every(this.isValidRequiredItem)
      : false
  }

  parseConfig(content: string): Config {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = load(content)
    if (this.isValidConfig(data)) return data
    throw new Error('Invalid configuration, ending action')
  }
}
