import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import fetchSessions from 'src/api/sessions/fetchSession'
import { UserRoles } from 'src/utils/enums/userRoles'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
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
      return fetchSessions(req, res)
    }
  }
}

export default handler
