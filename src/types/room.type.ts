import { tagsDT, tagsFI } from './tags.type'

export type Room = {
  _id: string
  sessionName: string
  roomCode: number
  participant1Code: string
  participant2Code: string
  messages: [
    {
      createdBy: string
      message: string
      timestamp: string
      tagFI: tagsFI
      tagDT: tagsDT
    }
  ]
}
