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

function calculateObservedAgreement(array: any[]) {
  const total = array.reduce((acc, row) => {
    return acc + row.reduce((acc: any, val: any) => acc + val, 0)
  }, 0)

  const agreements = array.reduce((acc, row, idx) => {
    return acc + row[idx]
  }, 0)

  const observedAgreement = agreements / total

  return observedAgreement
}

function calculateChanceAgreement(array: any[]) {
  const total = array.reduce((acc, row) => {
    return acc + row.reduce((acc: any, val: any) => acc + val, 0)
  }, 0)

  const chanceAgreement = array.reduce((acc, row, idx) => {
    const sumOfRow = row.reduce((acc: any, val: any) => acc + val, 0)
    const sumOfColumn = array.reduce((acc: any, val: any) => acc + val[idx], 0)
    return acc + (sumOfRow / total) * (sumOfColumn / total)
  }, 0)

  return chanceAgreement
}

function calculateCohenKappa(
  observedAgreement: number,
  chanceAgreement: number
) {
  const cohenKappa =
    (observedAgreement - chanceAgreement) / (1 - chanceAgreement)

  return Math.round(cohenKappa * 100) / 100
}

function getCohenKappa(rooms: IRoom[]) {
  const fiArray = createSquareMatrix(tagFIOptions.length)
  const dtArray = createSquareMatrix(tagDTOptions.length)

  rooms.forEach((room: IRoom) => {
    const twoRatersMessages = room.messages.filter(
      ({ tags }: IMessage) => tags && Object.keys(tags)?.length === 2
    )

    twoRatersMessages.forEach((message: IMessage) => {
      const [firstReviewerTags, secondReviewerTags] = Object.values(
        message.tags
      )

      const tagFIReviewer1 = tagFIOptions.findIndex(
        (t) => t === firstReviewerTags.tagFI
      )

      const tagFIReviewer2 = tagFIOptions.findIndex(
        (t) => t === secondReviewerTags.tagFI
      )

      fiArray[tagFIReviewer1][tagFIReviewer2] += 1

      const tagDTReviewer1 = tagDTOptions.findIndex(
        (t) => t === firstReviewerTags.tagDT
      )

      const tagDTReviewer2 = tagDTOptions.findIndex(
        (t) => t === secondReviewerTags.tagDT
      )

      dtArray[tagDTReviewer1][tagDTReviewer2] += 1
    })
  })

  const fiObservedAgreement = calculateObservedAgreement(fiArray)
  const fiChanceAgreement = calculateChanceAgreement(fiArray)
  const fiCohen = calculateCohenKappa(fiObservedAgreement, fiChanceAgreement)

  const dtObservedAgreement = calculateObservedAgreement(dtArray)
  const dtChanceAgreement = calculateChanceAgreement(dtArray)
  const dtCohen = calculateCohenKappa(dtObservedAgreement, dtChanceAgreement)

  return {
    fiCohen,
    dtCohen,
  }
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

    const taggedMessages = getCohenKappa(data)
    console.log(taggedMessages)
  } catch (error) {
    console.error(error)
  }
}
