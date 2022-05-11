export default function getRoomChats(dataset) {
  var rooms = new Map()

  for (var i = 0; i < dataset.participants.length; i++) {
    const p = dataset.participants[i]

    var room = []

    if (rooms.has(p.room)) {
      room = rooms.get(p.room)
    }

    room.push(p.code)
    rooms.set(p.room, room)
  }

  var chats = new Map()

  for (let [key, value] of rooms) {
    console.log(key + ' = ' + value)
    let p1 = value[0]
    let p2 = value[1]

    var chat = dataset.logs
      .filter(
        (l) => l.category == 'Chat' && (l.createdBy == p1 || l.createdBy == p2)
      )
      .map((l) => {
        return { by: l.createdBy, msg: l.payload, ts: l.timestamp }
      })

    chats.set(key, chat)
  }

  return { rooms, chats }
}
