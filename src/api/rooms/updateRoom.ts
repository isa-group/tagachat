import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'

async function updateRoom(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { sessionName, roomCode } = req.query

    if (!sessionName) throw new Error('no session id was provided')
    if (!roomCode) throw new Error('no room id was provided')

    if (Array.isArray(sessionName)) sessionName = sessionName.join('')
    if (Array.isArray(roomCode)) roomCode = roomCode.join('')

    const client = await clientPromise
    const db = client.db()

    await db.collection('rooms').updateOne(
      {
        sessionName,
        roomCode: parseInt(roomCode),
      },
      {
        $set: {
          'messages.$[message]': req.body.taggedMessage,
        },
      },
      {
        arrayFilters: [{ 'message.id': req.body.taggedMessage.id }],
      }
    )

    return res.status(200).json({
      message: 'Room updated',
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: getErrorMessage(error),
      success: false,
    })
  }
}

export default updateRoom
