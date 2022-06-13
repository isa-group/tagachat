import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import AuthCard from '../auth/AuthCard'

import AuthText from '../auth/AuthText'
import UserProfileForm from './UserProfileForm'

const UserProfile = () => {
  return (
    <>
      <Head>
        <title>Profile | tag-a-chat</title>
      </Head>
      <Box maxW="md" mx="auto" py="12" px="4">
        <AuthText
          headingText="Your Profile"
          helperText="You can reset your password here"
        />
        <AuthCard shadow="xs">
          <UserProfileForm />
        </AuthCard>
      </Box>
    </>
  )
}

export default UserProfile
