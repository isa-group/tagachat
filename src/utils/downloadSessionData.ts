import axios from 'axios'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { tagDTOptions, tagFIOptions } from './tagOptions'

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
    'f_r',
    'i_r',
    's_r',
    'u_r',
    'd_r',
    'su_r',
    'ack_r',
    'm_r',
    'qyn_r',
    'ayn_r',
    'qwh_r',
    'awh_r',
    'fp_r',
    'fnon_r',
    'o_r',
  ].join(',') + '\n'

const tagsFI = tagFIOptions.reduce((acc, tag) => {
  acc.set(tag, 0)
  return acc
}, new Map())

const completeTags = tagDTOptions.reduce((acc, tag) => {
  acc.set(tag, 0)
  return acc
}, tagsFI)

function convertData(rooms: IRoom[]) {
  const taggedMessages: string[] = []

  rooms.forEach((room: IRoom) => {
    const { sessionName, roomCode, messages } = room

    const flattenedMessages = messages
      .map((loopMessage: IMessage) => {
        const { createdBy, block, tags } = loopMessage

        if (tags) {
          return Object.entries(tags).map(
            ([reviewer, tags]) =>
              new Map<string, string | number>(
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

    const groupedByReviewer = flattenedMessages.reduce(
      (acc, curr) => {
        const reviewer = curr.get('reviewer') as string
        const block = curr.get('block') as number
        const createdBy = curr.get('createdBy') as number

        if (!acc[reviewer]) {
          acc[reviewer] = {}
        }

        if (!acc[reviewer][block]) {
          acc[reviewer][block] = {}
        }

        if (!acc[reviewer][block][createdBy]) {
          acc[reviewer][block][createdBy] = []
        }

        acc[reviewer][block][createdBy].push(curr)

        return acc
      },
      {} as {
        [reviewer: string]: {
          [block: number]: {
            [createdBy: number]: Map<string, string | number>[]
          }
        }
      }
    )

    const messageCountPerBlockAndParticipant = messages.reduce(
      (acc, message: IMessage) => {
        const { block, createdBy } = message
        if (acc.has(block)) {
          if (acc.get(block).has(createdBy)) {
            acc.get(block).set(createdBy, acc.get(block).get(createdBy) + 1)
          } else {
            acc.get(block).set(createdBy, 1)
          }
        } else {
          acc.set(block, new Map([[createdBy, 1]]))
        }
        return acc
      },
      new Map()
    )

    Object.values(groupedByReviewer).forEach((block) => {
      Object.values(block).forEach((createdBy) => {
        const messagesByBlock: Map<any, any>[] = []

        Object.values(createdBy).forEach((messages) => {
          const tagCount = new Map()
          messages.forEach((message) => {
            const fi = message.get('tagFI')
            const dt = message.get('tagDT')

            if (fi) tagCount.set(fi, (tagCount.get(fi) || 0) + 1)
            if (dt) tagCount.set(dt, (tagCount.get(dt) || 0) + 1)
          })

          const taggedMessage = new Map([...messages[0], ...tagCount])
          taggedMessage.delete('tagFI')
          taggedMessage.delete('tagDT')

          messagesByBlock.push(taggedMessage)
        })

        // getting sum of tags in each message
        const totalTagCount = new Map()
        messagesByBlock.forEach((message) => {
          message.forEach((value, key) => {
            if (tagFIOptions.includes(key) || tagDTOptions.includes(key)) {
              totalTagCount.set(key, (totalTagCount.get(key) || 0) + value)
            }
          })
        })

        // adding relative frequency to each message
        messagesByBlock.forEach((message) => {
          message.forEach((value, key) => {
            if (tagFIOptions.includes(key) || tagDTOptions.includes(key)) {
              const messageCount = messageCountPerBlockAndParticipant
                .get(message.get('block'))
                .get(message.get('createdBy'))

              message.set(
                `${key}_r`,
                ((!totalTagCount.get(key) ? 0 : value) / messageCount).toFixed(
                  4
                )
              )
            }
          })
        })

        const finalMessage = messagesByBlock
          .map((message) => Array.from(message.values()).join(','))
          .join('\n')

        taggedMessages.push(finalMessage)
      })
    })
  })

  const csv = headers + taggedMessages.join('\n')
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
