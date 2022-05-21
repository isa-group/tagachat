type ParticipantData = { code: string; room: number }

function getRoomData(participants: ParticipantData[]) {
  const rooms = new Map()

  for (const { room, code } of participants) {
    let participantsCodes = []

    if (rooms.has(room)) participantsCodes = rooms.get(room)

    participantsCodes.push(code)
    rooms.set(room, participantsCodes)
  }

  return rooms
}

function getChatData(rooms: Map<any, any>, logs: any[]) {
  const chats = new Map()

  for (let [key, participants] of rooms) {
    const [participant1, participant2] = participants

    const filteredChat = logs
      .filter(
        (log) =>
          log.category == 'Chat' &&
          (log.createdBy === participant1 || log.createdBy === participant2)
      )
      .map((log) => ({
        createdBy: log.createdBy,
        message: log.payload,
        timestamp: log.timestamp,
      }))

    chats.set(
      {
        room: key,
        participant1code: participant1,
        participant2code: participant2,
      },
      filteredChat
    )
  }

  return chats
}

export default function getRoomChats(dataset: {
  participants: ParticipantData[]
  logs: any[]
  session: any
}) {
  const rooms = getRoomData(dataset.participants)

  const data = getChatData(rooms, dataset.logs)

  return {
    sessionName: dataset.session,
    data,
  }
}
