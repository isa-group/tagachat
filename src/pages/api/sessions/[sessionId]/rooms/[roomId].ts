import type { NextApiRequest, NextApiResponse } from 'next'
import addRoom from 'src/api/rooms/addRoom'
import deleteRoom from 'src/api/rooms/deleteRoom'
import getRoom from 'src/api/rooms/getRoom'
import updateRoom from 'src/api/rooms/updateRoom'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getRoom(req, res)
    }

    case 'POST': {
      return addRoom(req, res)
    }

    case 'PATCH': {
      return updateRoom(req, res)
    }

    case 'DELETE': {
      return deleteRoom(req, res)
    }
  }
}

export default handler
