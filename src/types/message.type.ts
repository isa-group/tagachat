import { tagsFI, tagsDT } from './tags.type'

export type IMessage = {
  id: number
  createdBy: string
  message: string
  timestamp: string
  block: 1 | 2
  tags: {
    [userEmail: string]: {
      tagFI: tagsFI
      tagDT: tagsDT
    }
  },
  prediction: {
    messageID: number
    prediction: Object
    date: string
  }
}
