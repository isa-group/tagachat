import type { NextApiRequest, NextApiResponse } from 'next'

import clientPromise from 'src/lib/mongodb'
import { hashPassword } from 'src/lib/bcryptjs'

type Data = {
  message: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: 'Route not valid' })
  }

  const { email, name, password } = req.body

  if (
    !email ||
    !email.includes('@') ||
    !name ||
    !password ||
    password.length < 6
  ) {
    return res.status(422).json({ message: 'Invalid Data' })
  }

  const client = await clientPromise
  const db = client.db()
  const usersCollection = db.collection('users')
  const user = await usersCollection.findOne({ email })

  if (user) {
    return res.status(422).json({ message: 'User already exists' })
  }

  const hashedPassword = await hashPassword(password)

  await usersCollection.insertOne({
    email,
    name,
    password: hashedPassword,
    role: 'reviewer',
    isActive: false,
  })

  return res.status(201).json({ message: `User was created` })
}

export default handler
