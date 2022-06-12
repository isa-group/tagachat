import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import AuthCard from '../auth/AuthCard'
import AuthContainer from '../auth/AuthContainer'
import AuthText from '../auth/AuthText'
import UserProfileForm from './UserProfileForm'

const UserProfile = () => {
  return (
    <>
      <Head>
        <title>Profile | tag-a-chat</title>
      </Head>
      <AuthContainer>
        <Box maxW="md" mx="auto">
          <AuthText
            headingText="Your Profile"
            helperText="You can reset your password here"
          />
          <AuthCard>
            <UserProfileForm />
          </AuthCard>
        </Box>
      </AuthContainer>
    </>
  )
}

export default UserProfile
