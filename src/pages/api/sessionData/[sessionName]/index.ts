import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import fetchSessionData from 'src/api/sessions/getUploadedData'
import { UserRoles } from 'src/utils/enums/userRoles'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }
  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }
  if (session.user.role !== UserRoles.ADMIN) {
    return res.status(403).json({
      message: 'Forbidden',
      success: false,
    })
  }
  switch (req.method) {
    case 'GET': {
      return fetchSessionData(req, res)
    }
  }
}

export default handler
