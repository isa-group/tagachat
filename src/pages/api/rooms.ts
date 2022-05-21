import type { NextApiRequest, NextApiResponse } from 'next'
import addRooms from 'src/api/rooms/addRooms'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return addRooms(req, res)
  }
}

export default handler
