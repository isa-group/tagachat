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
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { UserRoles } from 'src/utils/enums/userRoles'

const SessionList: FC = (props) => {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.700')
  const toast = useToast()

  const { data: session } = useSession()

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions`)
      setData(data)
    }

    getData()
  }, [])

  useEffect(() => {
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
    }
  }, [router, session, toast])

  return (
    <Box padding="8">
      <Heading as="h1" size="lg">
        Sessions
      </Heading>

      <VStack spacing={30} mt={5}>
        {data.map((session: { _id: string; name: string }) => (
          <Box
            key={session._id}
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
              <Text>{session.name}</Text>
              <Button onClick={() => router.push(`/sessions/${session._id}`)}>
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
