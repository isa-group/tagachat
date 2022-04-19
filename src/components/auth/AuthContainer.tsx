import { Box, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

const AuthContainer: FC = (props) => {
  return (
    <Box
      bg={useColorModeValue('blue.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{
        base: '4',
        lg: '8',
      }}
      {...props}
    />
  )
}

export default AuthContainer
