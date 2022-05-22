import { IMessage } from './message.type'

export type IRoom = {
  _id: string
  sessionName: string
  roomCode: number
  participant1Code: string
  participant2Code: string
  messages: IMessage[]
}
