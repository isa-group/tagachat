import { differenceInMinutes } from 'date-fns'
import { IMessage } from 'src/types/message.type'

type ParticipantData = { code: string; room: number }

function getRooms(participants: ParticipantData[]) {
  const rooms = new Map()

  for (const { room, code } of participants) {
    let participantsCodes = []

    if (rooms.has(room)) participantsCodes = rooms.get(room)

    participantsCodes.push(code)
    rooms.set(room, participantsCodes)
  }

  return rooms
}

function getChats(rooms: Map<any, any>, logs: any[]) {
  const chats = new Map()

  for (let [key, participants] of rooms) {
    const [participant1, participant2] = participants

    const filteredChats = logs
      .filter(
        (log) =>
          log.category == 'Chat' &&
          (log.createdBy === participant1 || log.createdBy === participant2)
      )
      .map((log, idx) => ({
        id: idx,
        createdBy: log.createdBy,
        message: log.payload.trim(),
        timestamp: log.timestamp,
      }))

    chats.set(
      {
        roomCode: key,
        participant1Code: participant1,
        participant2Code: participant2,
      },
      filteredChats
    )
  }

  return chats
}

function cleanData(chats: Map<any, any>, sessionName: any) {
  const cleanData = []

  for (let [key, value] of chats) {
    if (!key.roomCode) continue
    if (!(key.participant1Code && key.participant2Code)) continue
    if (value.length === 0) continue

    const blockIndex = value.findIndex(
      (message: IMessage, i: number, array: IMessage[]) => {
        const element = message
        const prevElement = array[i - 1] ? array[i - 1] : element

        const date = new Date(element.timestamp)
        const prevDate = new Date(prevElement.timestamp)

        return differenceInMinutes(date, prevDate) >= 20
      }
    )

    const messagesWithBlocks = value.map((message: IMessage, idx: number) => ({
      ...message,
      block: idx < blockIndex ? 1 : 2,
    }))

    const room = {
      ...key,
      sessionName,
      messages: messagesWithBlocks,
    }

    cleanData.push(room)
  }

  return cleanData
}

export default function getTwincodeData(dataset: {
  participants: ParticipantData[]
  logs: any[]
  session: any
}) {
  const rooms = getRooms(dataset.participants)
  const chats = getChats(rooms, dataset.logs)
  const cleanedData = cleanData(chats, dataset.session)

  return {
    sessionName: dataset.session,
    data: cleanedData,
  }
}
