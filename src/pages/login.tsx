import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import AuthCard from '../components/auth/AuthCard'
import AuthContainer from '../components/auth/AuthContainer'
import AuthHeader from '../components/auth/AuthHeader'
import AuthText from '../components/auth/AuthText'
import LoginForm from '../components/auth/forms/LoginForm'

function Login() {
  return (
    <>
      <Head>
        <title>Log In | tag-a-chat</title>
      </Head>
      <AuthContainer>
        <AuthHeader />
        <Box maxW="md" mx="auto">
          <AuthText
            headingText="Log In"
            helperText="Don't have an account? "
            linkHref="/signup"
            linkText="Sign Up!"
          />
          <AuthCard>
            <LoginForm />
          </AuthCard>
        </Box>
      </AuthContainer>
    </>
  )
}

export default Login
