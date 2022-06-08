// @ts-nocheck
import axios from 'axios'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { tagDTOptions, tagFIOptions } from './tagOptions'

const tagsFI = tagFIOptions.reduce((acc, tag) => {
  acc.set(tag, 0)
  return acc
}, new Map())

const completeTags = tagDTOptions.reduce((acc, tag) => {
  acc.set(tag, 0)
  return acc
}, tagsFI)

function convertData(rooms: IRoom[]) {
  const headers =
    [
      'session',
      'room',
      'participant',
      'block',
      'reviewer',
      'f',
      'i',
      's',
      'u',
      'd',
      'su',
      'ack',
      'm',
      'qyn',
      'ayn',
      'qwh',
      'awh',
      'fp',
      'fnon',
      'o',
    ].join(',') + '\n'

  const ultimateEpicData = []

  rooms.forEach((room: IRoom) => {
    const { sessionName, roomCode, messages } = room

    const flattenedValues = messages
      .map((loopMessage: IMessage) => {
        const { createdBy, block, tags } = loopMessage

        if (tags) {
          return Object.entries(tags).map(
            ([reviewer, tags]) =>
              new Map(
                Object.entries({
                  sessionName,
                  roomCode,
                  createdBy,
                  block,
                  reviewer,
                  tagFI: tags.tagFI,
                  tagDT: tags.tagDT,
                  ...Object.fromEntries(completeTags),
                })
              )
          )
        }

        return []
      })
      .flat()

    const groupedByReviewer = flattenedValues.reduce((acc, curr) => {
      const reviewer = curr.get('reviewer')
      const createdBy = curr.get('createdBy')
      const block = curr.get('block')

      if (!acc[reviewer]) {
        acc[reviewer] = {}
      }

      if (!acc[reviewer][createdBy]) {
        acc[reviewer][createdBy] = {}
      }

      if (!acc[reviewer][createdBy][block]) {
        acc[reviewer][createdBy][block] = []
      }

      acc[reviewer][createdBy][block].push(curr)

      return acc
    }, {})

    Object.values(groupedByReviewer).forEach((createdBy) => {
      Object.values(createdBy).forEach((blocks) => {
        Object.values(blocks).forEach((messages) => {
          const tagCount = new Map()

          messages.forEach((message) => {
            const fi = message.get('tagFI')
            const dt = message.get('tagDT')

            if (fi) tagCount.set(fi, (tagCount.get(fi) || 0) + 1)
            if (dt) tagCount.set(dt, (tagCount.get(dt) || 0) + 1)
          })

          const newMap = new Map([...messages[0], ...tagCount])
          newMap.delete('tagFI')
          newMap.delete('tagDT')

          const mapIntoArray = Array.from(newMap.values())
          const arrayIntoText = mapIntoArray.join(',')
          ultimateEpicData.push(arrayIntoText)
        })
      })
    })
  })

  const csv = headers + ultimateEpicData.join('\n')
  return csv
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
