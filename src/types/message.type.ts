import { tagsFI, tagsDT } from './tags.type'

export type IMessage = {
  id: number
  createdBy: string
  message: string
  timestamp: string
  tagFI?: tagsFI
  tagDT?: tagsDT
}
