import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import AuthCard from '../components/auth/AuthCard'
import AuthContainer from '../components/auth/AuthContainer'
import AuthHeader from '../components/auth/AuthHeader'
import AuthText from '../components/auth/AuthText'
import SignupForm from '../components/auth/forms/SignupForm'

function SignUp() {
  return (
    <>
      <Head>
        <title>Sign Up | tag-a-chat</title>
      </Head>
      <AuthContainer>
        <AuthHeader />
        <Box maxW="md" mx="auto">
          <AuthText
            headingText="Sign Up"
            helperText="Already have an account? "
            linkHref="/login"
            linkText="Log In!"
          />
          <AuthCard>
            <SignupForm />
          </AuthCard>
        </Box>
      </AuthContainer>
    </>
  )
}

export default SignUp
