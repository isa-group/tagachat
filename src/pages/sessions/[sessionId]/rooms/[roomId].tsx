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
import { tagsFI, tagsDT } from 'src/types/tags.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

type RoomData = {
  _id: string
  sessionId: string
  user1Id: number
  user2Id: number
  first_block: {
    reviewer1CompletionRate: number
    reviewer2CompletionRate: number
    messages: [
      {
        id: number
        userId: number
        message: string
        tagFI: tagsFI
        tagDT: tagsDT
      }
    ]
  }
  second_block: {
    reviewer1CompletionRate: number
    reviewer2CompletionRate: number
    messages: [
      {
        id: number
        userId: number
        message: string
        tagFI: tagsFI
        tagDT: tagsDT
      }
    ]
  }
}

const Room: FC = () => {
  const router = useRouter()
  const { sessionId, roomId } = router.query

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RoomData>()

  const [completionRate, setCompletionRate] = useState(0)
  const [messages, setMessages] = useState([])

  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.100', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')

  useEffect(() => {
    if (!router.isReady) return
    if (!(sessionId && roomId)) return

    const getData = async () => {
      try {
        setLoading(true)
        const {
          data: { data },
        } = await axios.get(`/api/sessions/${sessionId}/rooms/${roomId}`)

        setData(data)
        setMessages(data.first_block.messages)
      } catch (error) {
        console.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [roomId, sessionId])

  useEffect(() => {
    if (data) {
      const dataLength = data?.first_block?.messages.length
      const responseLength = messages.length
      setCompletionRate(Math.round((responseLength / dataLength) * 100))
    }
  }, [data, messages])

  const saveResults = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3005/sessions/${sessionId}/rooms/${roomId}`,
        {
          first_block: {
            reviewer1CompletionRate: completionRate,
            reviewer2CompletionRate: 0,
            missingCompletionRate: 100 - completionRate,
            messages: messages,
          },
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
          <Heading>Room {roomId} - first block</Heading>
          <Spacer />
          <Flex direction="row" align="center" justify="center" gap="30px">
            <Box bg={user1bg} padding="2" rounded="10">
              <Text>User ID: {data?.user1Id}</Text>
            </Box>
            <Box bg={user2bg} padding="2" rounded="10">
              <Text>User ID: {data?.user2Id}</Text>
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
          {data?.first_block.messages.map((message) => (
            <Message
              key={message.id}
              setTags={setMessages}
              backgroundColor={
                data?.user1Id === message.userId ? user1bg : user2bg
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
