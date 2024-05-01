import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { convertData, streamSessionData } from 'src/utils/downloadSessionData'
import { IRoom } from 'src/types/room.type'

function CSVToJSON(csv: string) {

    const lines = csv.split('\n')
    const result = []
    const headers = lines[0].split(',')

    for (let i = 1; i < lines.length; i++) {
      const obj: { [key: string]: string } = {}
      const currentline = lines[i].split(',')

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]
      }

      result.push(obj)
    }

    return result
}



async function getSessionData(req: NextApiRequest, res: NextApiResponse) {
    let { sessionName, reviewers } = req.query

    let parsedReviewers: string[] = []
    if (reviewers) {
        if (Array.isArray(reviewers)) {
            parsedReviewers = reviewers.map((reviewer) => {
                return reviewer.toString()
            }
            )
        } else {
            parsedReviewers = reviewers.toString().split(',')
        }


    }

    
    if (!sessionName) throw new Error('no session id was provided')
    if (Array.isArray(sessionName)) sessionName = sessionName.join('')

    const client = await clientPromise
    const db = client.db()
    const rooms = await db
      .collection('rooms')
      .find({
        sessionName,
      })
      .toArray()
    
    const newRooms: IRoom[] = rooms.map((room) => {
        const { sessionName, roomCode, messages, _id, participant1Code, participant2Code } = room
        const id = _id.toString()
        return {
            _id:id,
            sessionName,
            roomCode,
            participant1Code,
            participant2Code,
            messages
        }
    }
    )



        const csv = convertData(newRooms);
        const json = CSVToJSON(csv)

        if (parsedReviewers.length > 0) {
            const filteredJson = json.filter((item) => {
                return parsedReviewers.includes(item.reviewer)
            }
            )
            return res.status(200).json(filteredJson);
        }


        res.status(200).json(json);


}

export default getSessionData
