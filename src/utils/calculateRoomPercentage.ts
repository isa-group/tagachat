import { IMessage } from 'src/types/message.type'

const calculateRoomPercentage = (messages: IMessage[], block: 1 | 2) => {
  const totalMessages = messages.filter((message) => message.block === block)

  const tagOcurrences = new Map()

  for (const message of messages) {
    if (message.block != block) continue

    for (const tag in message.tags) {
      tagOcurrences.set(tag, (tagOcurrences.get(tag) || 0) + 1)
    }
  }

  const result = Array.from(tagOcurrences.entries()).reduce((acc, curr) => {
    acc.push({
      reviewer: curr[0],
      percentage: Math.round((curr[1] / totalMessages.length) * 100),
    })
    return acc
  }, [] as { reviewer: string; percentage: number }[])

  return result
}

export default calculateRoomPercentage
