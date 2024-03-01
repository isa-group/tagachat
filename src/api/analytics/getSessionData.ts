import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { convertData, streamSessionData } from 'src/utils/downloadSessionData'
import { IRoom } from 'src/types/room.type'

async function getSessionData(req: NextApiRequest, res: NextApiResponse) {
    let { sessionName } = req.query


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
    
    //convert rooms to IRoom[]
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

    const csv = convertData(newRooms)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=${sessionName}.csv`)
    res.status(200).send(csv)


    //res a csv file
}

export default getSessionData
