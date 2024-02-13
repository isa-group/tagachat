import type { NextApiRequest, NextApiResponse } from 'next'
import fetchSessionData from 'src/api/sessions/getUploadedData'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return fetchSessionData(req, res)
    }
  }
}

export default handler
