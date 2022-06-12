import type { NextApiRequest, NextApiResponse } from 'next'

import clientPromise from 'src/lib/mongodb'
import { hashPassword, verifyPassword } from 'src/lib/bcryptjs'
import { getSession } from 'next-auth/react'

type Data = {
  message: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PATCH') {
    return res.status(500).json({ message: 'Route not valid' })
  }

  const session = await getSession({ req: req })

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const { currentPassword, newPassword } = req.body
  const { email } = session.user

  const client = await clientPromise
  const db = client.db()
  const usersCollection = db.collection('users')
  const user = await usersCollection.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const passwordsAreEqual = await verifyPassword(currentPassword, user.password)

  if (!passwordsAreEqual) {
    return res.status(403).json({ message: 'Invalid password' })
  }

  const newHashedPassword = await hashPassword(newPassword)

  await usersCollection.findOneAndUpdate(
    {
      email,
    },
    {
      $set: {
        password: newHashedPassword,
      },
    }
  )

  return res.status(200).json({ message: `Password updated` })
}

export default handler
