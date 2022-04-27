import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import useFetch from 'src/hooks/useFetch'

const SessionList: FC = (props) => {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.700')

  const { data: session } = useSession()
  console.log(session)

  const { data, isLoading, isError } = useFetch(
    'http://localhost:3005/sessions'
  )

  if (isError) return <div>failed to load</div>
  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="8">
      <Heading as="h1" size="lg">
        Sessions
      </Heading>

      <VStack spacing={30} mt={5}>
        {data.map((session) => (
          <Box
            key={session.id}
            w="100%"
            h="70px"
            padding="10"
            bg={bg}
            rounded="10"
          >
            <Flex
              height="100%"
              direction="row"
              align="center"
              justify="space-between"
            >
              <Text>Session {session.id}</Text>
              <Button onClick={() => router.push(`/sessions/${session.id}`)}>
                Open
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default SessionList
