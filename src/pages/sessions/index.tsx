import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import useFetch from 'src/hooks/useFetch'

const SessionList: FC = (props) => {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.700')
  const toast = useToast()

  const { data: session } = useSession()

  const { data, isLoading, isError } = useFetch(
    'http://localhost:3005/sessions'
  )

  useEffect(() => {
    if (
      !(
        session?.user.role === 'admin' ||
        session?.user.role === 'reviewer' ||
        session?.user.isActive
      )
    ) {
      toast({
        title: "You don't have permissions to view this page",
        description: 'Redirecting you to homepage...',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/')
    }
  }, [router, session, toast])

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
