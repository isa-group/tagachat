import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import addRoom from 'src/api/rooms/addRoom'
import deleteRoom from 'src/api/rooms/deleteRoom'
import getRoom from 'src/api/rooms/getRoom'
import updateRoom from 'src/api/rooms/updateRoom'
import { UserRoles } from 'src/utils/enums/userRoles'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }
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
      if (session?.user.role !== UserRoles.ADMIN) {
        return res.status(401).json({
          message: 'You are not authorized to delete rooms',
          success: false,
        })
      }

      return deleteRoom(req, res)
    }
  }
}

export default handler
