import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import SessionModal from 'src/components/sessions/SessionModal'

const SessionList: FC = (props) => {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.700')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: session } = useSession()

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`http://localhost:3005/sessions`)
      setData(data)
    }

    getData()
  }, [])

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

  return (
    <Box padding="8">
      <HStack>
        <Heading as="h1" size="lg">
          Sessions
        </Heading>

        <Spacer />

        <Button onClick={onOpen}>
          <Text>Import Session</Text>
        </Button>
      </HStack>

      <SessionModal isOpen={isOpen} onClose={onClose} />

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
