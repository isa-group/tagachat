import { IRoom } from './../types/room.type'

const calculateRoomPercentage = (room: IRoom) => {
  const totalMessages = room.messages.length

  const tagOcurrences = new Map()

  for (const message of room.messages) {
    for (const tag in message.tags) {
      tagOcurrences.set(tag, (tagOcurrences.get(tag) || 0) + 1)
    }
  }

  const result = Array.from(tagOcurrences.entries()).reduce((acc, curr) => {
    acc.push({
      tag: curr[0],
      percentage: Math.round((curr[1] / totalMessages) * 100),
    })
    return acc
  }, [] as { tag: string; percentage: number }[])

  return result
}

export default calculateRoomPercentage
