export default function getRoomChats(dataset) {
  const rooms = new Map()

  for (const participant of dataset.participants) {
    let room = []

    if (rooms.has(participant.room)) {
      room = rooms.get(participant.room)
    }

    room.push(participant.code)
    rooms.set(participant.room, room)
  }

  const chats = new Map()

  for (let [key, value] of rooms.entries()) {
    let p1 = value[0]
    let p2 = value[1]

    const filteredChat = dataset.logs
      .filter(
        (log) =>
          log.category == 'Chat' &&
          (log.createdBy === p1 || log.createdBy === p2)
      )
      .map((log) => ({
        createdBy: log.createdBy,
        message: log.payload,
        timestamp: log.timestamp,
      }))

    chats.set(key, filteredChat)
  }

  const data = {
    sessionName: dataset.session,
    rooms,
    chats,
  }

  return data
}
