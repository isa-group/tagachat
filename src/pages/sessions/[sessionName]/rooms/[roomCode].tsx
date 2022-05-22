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
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import Message from 'src/components/rooms/Message'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

const Room: FC = () => {
  const router = useRouter()
  const { sessionName, roomCode } = router.query

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IRoom>()
  const [taggedMessages, setTaggedMessages] = useState<IMessage[]>([])

  const [completionRate, setCompletionRate] = useState(0)

  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.100', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')

  useEffect(() => {
    if (!(roomCode && sessionName)) return

    const getData = async () => {
      try {
        setLoading(true)

        const {
          data: { data },
        } = await axios.get(`/api/sessions/${sessionName}/rooms/${roomCode}`)

        setData(data)

        if (data.messages) {
          setTaggedMessages(
            data?.messages.filter((m: IMessage) => m.tagFI && m.tagDT)
          )
        }
      } catch (error) {
        console.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [roomCode, sessionName])

  useEffect(() => {
    if (!data) return

    const dataLength = data?.messages.length
    const taggedMessagesLength = taggedMessages?.length ?? 0

    setCompletionRate(Math.round((taggedMessagesLength / dataLength) * 100))
  }, [data, taggedMessages?.length])

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
          <Heading>Room {roomCode}</Heading>
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
        </Flex>

        <VStack spacing="20px" mt={5}>
          {data?.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              sessionName={sessionName}
              roomCode={roomCode}
              setTaggedMessages={setTaggedMessages}
              backgroundColor={
                data?.participant1Code === message.createdBy ? user1bg : user2bg
              }
            />
          ))}
        </VStack>
      </Box>
    )
  )
}

export default Room
