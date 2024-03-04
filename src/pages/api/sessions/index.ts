import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import addSession from 'src/api/sessions/addSession'
import getSessions from 'src/api/sessions/getSessions'

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
      return getSessions(req, res)
    }

    case 'POST': {
      return addSession(req, res)
    }

    case 'PUT': {
    }

    case 'DELETE': {
    }
  }
}

export default handler
