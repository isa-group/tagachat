import axios from 'axios'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import {
  calculateChanceAgreement,
  calculateCohenKappa,
  calculateObservedAgreement,
  createSquareMatrix,
} from './calculateKappa'
import { tagDTOptions, tagFIOptions } from './tagOptions'

function calculateKappaOneRoom(
  room: IRoom,
  fiArray: number[][],
  dtArray: number[][]
) {
  const twoRatersMessages = room.messages.filter(
    ({ tags }: IMessage) => tags && Object.keys(tags)?.length === 2
  )

  twoRatersMessages.forEach((message: IMessage) => {
    const [firstReviewerTags, secondReviewerTags] = Object.values(message.tags)

    const tagFIReviewer1 = tagFIOptions.findIndex(
      (t) => t === firstReviewerTags.tagFI
    )

    const tagFIReviewer2 = tagFIOptions.findIndex(
      (t) => t === secondReviewerTags.tagFI
    )

    if (tagFIReviewer1 !== -1 && tagFIReviewer2 !== -1) {
      fiArray[tagFIReviewer1][tagFIReviewer2]++
    }

    const tagDTReviewer1 = tagDTOptions.findIndex(
      (t) => t === firstReviewerTags.tagDT
    )

    const tagDTReviewer2 = tagDTOptions.findIndex(
      (t) => t === secondReviewerTags.tagDT
    )

    if (tagDTReviewer1 !== -1 && tagDTReviewer2 !== -1) {
      dtArray[tagDTReviewer1][tagDTReviewer2]++
    }
  })
}

function getCohenKappa(data: IRoom[] | IRoom) {
  const fiArray = createSquareMatrix(tagFIOptions.length)
  const dtArray = createSquareMatrix(tagDTOptions.length)

  if (Array.isArray(data)) {
    data.forEach((room) => calculateKappaOneRoom(room, fiArray, dtArray))
  } else {
    calculateKappaOneRoom(data, fiArray, dtArray)
  }

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
  sessionName: string,
  roomCode: string | undefined
) {
  e.stopPropagation()

  try {
    const {
      data: { data },
    } = await axios.get(
      `/api/sessions/${sessionName}/rooms/` + `${roomCode ? roomCode : ''}`
    )

    return getCohenKappa(data)
  } catch (error) {
    console.error(error)
  }
}
