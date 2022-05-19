import type { NextApiRequest, NextApiResponse } from 'next'
import getRoom from 'src/api/rooms/getRoom'
import updateRoom from 'src/api/rooms/updateRoom'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getRoom(req, res)
    }

    case 'PATCH': {
      return updateRoom(req, res)
    }

    case 'DELETE': {
    }
  }
}

export default handler
