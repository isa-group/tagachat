import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import getReviewers from 'src/api/users/getReviewers'
import updateReviewer from 'src/api/users/updateReviewer'
import { UserRoles } from 'src/utils/enums/userRoles'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
      success: false,
    })
  }

  if (session?.user.role !== UserRoles.ADMIN) {
    return res.status(401).json({
      message: 'You are not authorized to delete rooms',
      success: false,
    })
  }

  if (req.method === 'GET') {
    return getReviewers(req, res)
  }

  if (req.method === 'PATCH') {
    return updateReviewer(req, res)
  }
}

export default handler
