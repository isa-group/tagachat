import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import addRooms from 'src/api/rooms/addRooms'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }
  if (req.method === 'POST') {
    return addRooms(req, res)
  }
}

export default handler
