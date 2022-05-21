import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
  Heading,
  Spacer,
  useColorModeValue,
  VStack,
  Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import Message from 'src/components/rooms/Message'
import { Room } from 'src/types/room.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

const Room: FC = () => {
  const router = useRouter()
  const { sessionName, roomCode } = router.query

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Room>()

  const [completionRate, setCompletionRate] = useState(0)
  const [messages, setMessages] = useState([])

  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.100', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')

  useEffect(() => {
    if (!router.isReady) return
    if (!(sessionName && roomCode)) return

    const getData = async () => {
      try {
        setLoading(true)
        const {
          data: { data },
        } = await axios.get(`/api/sessions/${sessionName}/rooms/${roomCode}`)

        setData(data)
        setMessages(data.messages)
      } catch (error) {
        console.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [router.isReady, roomCode, sessionName])

  useEffect(() => {
    if (data) {
      const dataLength = data?.messages.length
      const responseLength = messages.length
      setCompletionRate(Math.round((responseLength / dataLength) * 100))
    }
  }, [data, messages])

  const saveResults = async () => {
    try {
      const response = await axios.patch(
        `/api/sessions/${sessionName}/rooms/${roomCode}`,
        {
          messages,
        }
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <LoadingSpinner loading={loading} />

  return (
    { data } && (
      <Box padding="8">
        <Flex
          direction="row"
          align="center"
          justify="center"
          sx={{
            bg: bg,
            paddingY: '4',
            position: 'sticky',
            top: '0',
          }}
        >
          <Heading>Room {roomCode} - first block</Heading>
          <Spacer />
          <Flex direction="row" align="center" justify="center" gap="30px">
            <Box bg={user1bg} padding="2" rounded="10">
              <Text>Participant ID: {data?.participant1Code}</Text>
            </Box>
            <Box bg={user2bg} padding="2" rounded="10">
              <Text>Participant ID: {data?.participant2Code}</Text>
            </Box>
          </Flex>
          <Spacer />
          <CircularProgress value={completionRate} size="70px">
            <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
          </CircularProgress>
          <Button ml={6} onClick={saveResults} colorScheme="blue">
            Save
          </Button>
        </Flex>

        <VStack spacing="20px" mt={5}>
          {data?.messages.map((message, index) => (
            <Message
              key={index}
              setTags={setMessages}
              backgroundColor={
                data?.participant1Code === message.createdBy ? user1bg : user2bg
              }
              {...message}
            />
          ))}
        </VStack>
      </Box>
    )
  )
}

export default Room
