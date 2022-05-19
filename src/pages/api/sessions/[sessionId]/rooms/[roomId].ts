import type { NextApiRequest, NextApiResponse } from 'next'
import getRoom from 'src/api/rooms/getRoom'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getRoom(req, res)
    }

    case 'PUT': {
    }

    case 'DELETE': {
    }
  }
}

export default handler
