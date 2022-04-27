import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from 'src/lib/mongodb'
import { verifyPassword } from 'src/lib/bcryptjs'

const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'email-login',
      name: 'login',
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

        return result
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role
      if (user?.isActive) token.isActive = user.isActive
      return token
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role as string
      if (token?.isActive) session.user.isActive = token.isActive as boolean
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(nextAuthOptions)
