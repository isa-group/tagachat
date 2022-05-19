import type { NextApiRequest, NextApiResponse } from 'next'
import getRooms from 'src/api/rooms/getRooms'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getRooms(req, res)
    }

    case 'PUT': {
    }

    case 'DELETE': {
    }
  }
}

export default handler
