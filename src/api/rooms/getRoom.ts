import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'

async function getRoom(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { sessionName, roomCode } = req.query

    if (!sessionName) throw new Error('no session id was provided')
    if (!roomCode) throw new Error('no room id was provided')

    if (Array.isArray(sessionName)) sessionName = sessionName.join('')
    if (Array.isArray(roomCode)) roomCode = roomCode.join('')

    const client = await clientPromise
    const db = client.db()

    const room = await db.collection('rooms').findOne({
      sessionName,
      roomCode: parseInt(roomCode),
    })

    return res.status(200).json({
      data: room,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: getErrorMessage(error),
      success: false,
    })
  }
}

export default getRoom
