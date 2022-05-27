import axios from 'axios'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'

function convertData(rooms: IRoom[]) {
  let headers =
    'session,room,participant,block,messageId,reviewer,tagFI,tagDT\n'

  rooms.forEach((room: IRoom) => {
    const { sessionName, roomCode, messages } = room

    messages.forEach((loopMessage: IMessage) => {
      const { createdBy, block, id, tags } = loopMessage

      for (const reviewer in tags) {
        headers += `${sessionName},${roomCode},${createdBy},${block},${id},${reviewer},${tags[reviewer].tagFI},${tags[reviewer].tagDT}\n`
      }
    })
  })

  return headers
}

export async function downloadSessionData(
  e: React.MouseEvent<HTMLButtonElement>,
  sessionName: string
) {
  e.stopPropagation()

  try {
    const {
      data: { data },
    } = await axios.get(`/api/sessions/${sessionName}/rooms`)

    const csv = convertData(data)

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${sessionName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error(error)
  }
}
