import type { NextApiRequest, NextApiResponse } from 'next'
import fetchSessions from 'src/api/sessions/fetchSession'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return fetchSessions(req, res)
    }
  }
}

export default handler
