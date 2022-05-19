import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { ObjectId } from 'mongodb'

async function getRooms(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { sessionId } = req.query

    if (!sessionId) throw new Error('no session id was provided')

    if (Array.isArray(sessionId)) sessionId = sessionId.join('')

    const client = await clientPromise
    const db = client.db()
    const rooms = await db
      .collection('rooms')
      .find({
        sessionId: new ObjectId(sessionId),
      })
      .toArray()

    return res.status(200).json({
      data: rooms,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: getErrorMessage(error),
      success: false,
    })
  }
}

export default getRooms
