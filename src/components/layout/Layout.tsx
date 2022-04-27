import { useRouter } from 'next/router'
import { Flex } from '@chakra-ui/react'
import Navbar from './Navbar'
import Footer from './Footer'
import { FC } from 'react'

const Layout: FC<{}> = ({ children }) => {
  const router = useRouter()

  if (
    router.pathname === '/signup' ||
    router.pathname === '/login' ||
    router.pathname === '/reset-password' ||
    router.pathname === '/reset-password/[token]'
  ) {
    return <>{children}</>
  }

  return (
    <Flex direction="column" minHeight="100vh">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Flex>
  )
}

export default Layout
