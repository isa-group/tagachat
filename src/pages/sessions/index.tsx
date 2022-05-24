import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
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
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import SessionModal from 'src/components/sessions/SessionModal'
import { UserRoles } from 'src/utils/enums/userRoles'

const SessionList: FC = (props) => {
  const router = useRouter()

  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.200', 'blue.800')

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(true)

  const { data: session } = useSession()

  const [data, setData] = useState([])
  const [updateSessions, setUpdateSessions] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions`)
      setData(data)
      setUpdateSessions(false)
      setIsLoading(false)
    }

    getData()
  }, [updateSessions])

  useEffect(() => {
    if (!session) return

    if (
      !(
        session?.user.role === UserRoles.REVIEWER ||
        session?.user.role === UserRoles.ADMIN ||
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
      setIsLoading(false)
    }
  }, [router, session, toast])

  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="3rem">
      <HStack>
        <Heading>Sessions</Heading>
        <Spacer />
        <Button onClick={onOpen}>Import Session</Button>
      </HStack>

      <SessionModal
        isOpen={isOpen}
        onClose={onClose}
        setUpdateSessions={setUpdateSessions}
      />

      <SimpleGrid columns={[2, null, 3]} spacing="2rem" mt="3rem">
        {data.map((session: { _id: string; name: string }) => (
          <Box
            key={session._id}
            bg={bg}
            padding="10"
            rounded="lg"
            boxShadow="md"
            transition="all 0.2s"
            _hover={{
              bg: bgOnHover,
              cursor: 'pointer',
              boxShadow: 'xl',
            }}
            onClick={() => router.push(`/sessions/${session.name}`)}
          >
            <Text fontSize="xl" align="center" fontWeight="bold">
              {session.name}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default SessionList
