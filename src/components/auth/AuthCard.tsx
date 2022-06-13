import {
  Box,
  BoxProps,
  ChakraComponent,
  useColorModeValue,
} from '@chakra-ui/react'

type DivComponent = ChakraComponent<'div', {}>

const AuthCard = ((props: BoxProps) => (
  <Box
    bg={useColorModeValue('white', 'gray.700')}
    py="8"
    px={{
      base: '4',
      md: '10',
    }}
    shadow="base"
    rounded={{
      sm: 'lg',
    }}
    {...props}
  />
)) as DivComponent

export default AuthCard
