import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import clientPromise from 'src/lib/mongodb'
import { verifyPassword } from 'src/lib/bcryptjs'

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@domain.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection('users')

        const result = await usersCollection.findOne({
          email: credentials?.email,
        })

        if (!result) {
          throw new Error('User not found')
        }

        const isValid = await verifyPassword(
          credentials!.password,
          result.password
        )

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return { email: result.email, name: result.name }
      },
    }),
  ],
}

export default NextAuth(nextAuthOptions)
