import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { connectToDatabase } from 'src/lib/mongodb'
import { verifyPassword } from 'src/lib/bcryptjs'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { db } = await connectToDatabase()

        const usersCollection = await db.collection('users')

        const result = await usersCollection.findOne({
          email: credentials.email,
        })

        if (!result) {
          throw new Error('User not found')
        }

        const isValid = await verifyPassword(
          credentials.password,
          result.password
        )

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return { email: result.email, name: result.name }
      },
    }),
  ],
})
