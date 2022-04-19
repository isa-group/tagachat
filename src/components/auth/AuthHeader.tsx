import {
  Flex,
  Heading,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import ThemeButton from '../common/ThemeButton'

function AuthHeader(props) {
  const textColors = useColorModeValue('blue.500', 'blue.200')

  return (
    <Flex
      justify="space-between"
      mb={{
        base: '10',
        md: '20',
      }}
      {...props}
    >
      <Link href="/" passHref>
        <ChakraLink>
          <Heading
            textAlign="center"
            size="lg"
            color={textColors}
            fontWeight="extrabold"
          >
            tag-a-chat
          </Heading>
        </ChakraLink>
      </Link>
      <ThemeButton />
    </Flex>
  )
}

export default AuthHeader
