import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { ObjectId } from 'mongodb'

async function updateReviewer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db()

    const updatedReviewer = await db.collection('users').findOneAndUpdate(
      {
        _id: new ObjectId(req.body._id),
        role: 'reviewer',
      },
      {
        $set: {
          isActive: req.body.isActive,
        },
      },
      {
        returnDocument: 'after',
      }
    )

    return res.status(200).json({
      data: updatedReviewer,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: getErrorMessage(error),
      success: false,
    })
  }
}

export default updateReviewer
