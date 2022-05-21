import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'

async function getRooms(req: NextApiRequest, res: NextApiResponse) {
  try {
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
