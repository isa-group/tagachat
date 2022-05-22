import {
  Box,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import { IRoom } from 'src/types/room.type'

const Session = () => {
  const router = useRouter()
  const { sessionName } = router.query

  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.200', 'blue.800')

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IRoom[]>([])

  useEffect(() => {
    if (!router.isReady) return

    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions/${sessionName}/rooms`)
      setData(data)
      setIsLoading(false)
    }

    getData()
  }, [router.isReady, sessionName])

  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="8">
      <Heading>Session: {sessionName}</Heading>

      <VStack spacing="10px" mt="40px">
        <HStack spacing="18rem" w="100%" padding="30px">
          <Heading size="lg">Room</Heading>
          <Heading size="lg">Block 1</Heading>
          <Heading size="lg">Block 2</Heading>
        </HStack>

        {data.map((room) => (
          <HStack
            key={room._id}
            spacing={20}
            w="100%"
            padding="30px"
            justify="space-between"
          >
            <Heading size="md">{room.roomCode}</Heading>
            <Box
              w="100%"
              padding="10"
              bg={bg}
              boxShadow={'md'}
              rounded={'lg'}
              onClick={() =>
                router.push(`/sessions/${sessionName}/rooms/${room.roomCode}`)
              }
              transition="all 0.2s"
              _hover={{
                bg: bgOnHover,
                cursor: 'pointer',
                boxShadow: 'xl',
              }}
            >
              <Text>
                <strong>Room Code:</strong> {room.roomCode}
              </Text>
            </Box>
            <Box
              w="100%"
              padding="10"
              bg={bg}
              boxShadow={'md'}
              rounded={'lg'}
              onClick={() =>
                router.push(`/sessions/${sessionName}/rooms/${room.roomCode}`)
              }
              transition="all 0.2s"
              _hover={{
                bg: bgOnHover,
                cursor: 'pointer',
                boxShadow: 'xl',
              }}
            >
              <Text>
                <strong>Here goes second block logic</strong>
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

export default Session
