import type { NextApiRequest, NextApiResponse } from 'next'
import addSession from 'src/api/sessions/addSession'
import getSessions from 'src/api/sessions/getSessions'

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
