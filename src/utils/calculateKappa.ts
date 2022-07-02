import axios from 'axios'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { tagDTOptions, tagFIOptions } from './tagOptions'

function createSquareMatrix(itemLength: number) {
  const array = new Array(itemLength)

  for (let i = 0; i < itemLength; i++) {
    array[i] = []

    for (let j = 0; j < itemLength; j++) {
      array[i].push(0)
    }
  }

  return array
}

function convertData(rooms: IRoom[]) {
  // create matrix of cohen kappa
  const fiArray = createSquareMatrix(tagFIOptions.length)

  rooms.forEach((room: IRoom) => {
    const twoRatersMessages = room.messages.filter(
      ({ tags }: IMessage) => tags && Object.keys(tags)?.length === 2
    )

    twoRatersMessages.forEach((message: IMessage) => {
      const [firstReviewerTags, secondReviewerTags] = Object.values(
        message.tags
      )

      const tagFIIndex1 = tagFIOptions.findIndex(
        (t) => t === firstReviewerTags.tagFI
      )

      const tagFIIndex2 = tagFIOptions.findIndex(
        (t) => t === secondReviewerTags.tagFI
      )

      fiArray[tagFIIndex1][tagFIIndex2] += 1
    })
  })

  const agreements = fiArray.reduce((acc, row, idx) => {
    return acc + row[idx]
  }, 0)

  const total = fiArray.reduce((acc, row) => {
    return acc + row.reduce((acc: any, val: any) => acc + val, 0)
  }, 0)

  const observedAgreement = agreements / total

  const chanceAgreement = fiArray.reduce((acc, row, idx) => {
    const sumOfRow = row.reduce((acc: any, val: any) => acc + val, 0)
    const sumOfColumn = fiArray.reduce(
      (acc: any, val: any) => acc + val[idx],
      0
    )
    return acc + (sumOfRow / total) * (sumOfColumn / total)
  }, 0)

  const cohenKappa =
    (observedAgreement - chanceAgreement) / (1 - chanceAgreement)
  const roundedKappa = Math.round(cohenKappa * 100) / 100

  return roundedKappa
}

export async function calculateKappa(
  e: React.MouseEvent<HTMLButtonElement>,
  sessionName: string
) {
  e.stopPropagation()

  try {
    const {
      data: { data },
    } = await axios.get(`/api/sessions/${sessionName}/rooms`)

    const taggedMessages = convertData(data)
    console.log(taggedMessages)
  } catch (error) {
    console.error(error)
  }
}
