import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import getSessionData from 'src/api/analytics/getSessionData'
import getSessionReviewers from 'src/api/analytics/getSessionReviewers'
import fetchSessionData from 'src/api/sessions/getUploadedData'
import { UserRoles } from 'src/utils/enums/userRoles'

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {
    case 'GET': {
      return getSessionReviewers(req, res)
    }
  }
}

export default handler
