import type { NextApiRequest, NextApiResponse } from 'next'
import getSessions from 'src/api/sessions/getSessions'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const { sessionId } = req.query
      res.end(`sessionId: ${sessionId}`)
    }

    case 'PUT': {
    }

    case 'DELETE': {
    }
  }
}

export default handler
