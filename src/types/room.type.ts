import { tagsDT, tagsFI } from './tags.type'

export type Room = {
  _id: string
  sessionId: string
  user1Id: number
  user2Id: number
  first_block: {
    reviewer1CompletionRate: number
    reviewer2CompletionRate: number
    messages: [
      {
        id: number
        userId: number
        message: string
        tagFI: tagsFI
        tagDT: tagsDT
      }
    ]
  }
  second_block: {
    reviewer1CompletionRate: number
    reviewer2CompletionRate: number
    messages: [
      {
        id: number
        userId: number
        message: string
        tagFI: tagsFI
        tagDT: tagsDT
      }
    ]
  }
}
