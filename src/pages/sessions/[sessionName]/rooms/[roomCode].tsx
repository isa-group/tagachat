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
  useToast,
  Icon,
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { HiUser } from 'react-icons/hi'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import Message from 'src/components/rooms/Message'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

const Room: FC = () => {
  const router = useRouter()
  const { sessionName, roomCode } = router.query

  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IRoom>()
  const [taggedMessages, setTaggedMessages] = useState<IMessage[]>([])

  const [completionRate, setCompletionRate] = useState(0)

  const { data: session } = useSession()
  const [currentUserMail, setCurrentUserMail] = useState('')

  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.200', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')

  useEffect(() => {
    if (!(roomCode && sessionName)) return
    if (!session?.user) return

    const { email, isActive } = session.user

    if (!email) return

    setCurrentUserMail(email)

    if (!isActive) {
      toast({
        title: `Your account is inactive, contact with a manager...`,
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      router.push('/')
      return
    }

    const getData = async () => {
      try {
        setLoading(true)

        const {
          data: { data },
        } = await axios.get(`/api/sessions/${sessionName}/rooms/${roomCode}`)

        setData(data)

        setTaggedMessages(
          data?.messages.filter(
            (m: IMessage) => m?.tags?.[email]?.tagFI && m?.tags?.[email]?.tagDT
          ) ?? 0
        )
      } catch (error) {
        console.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [roomCode, sessionName, session?.user, toast, router])

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
            zIndex: '1',
          }}
        >
          <Heading>Room {roomCode}</Heading>
          <Spacer />
          <Flex direction="row" align="center" justify="center" gap="30px">
            <Box bg={user1bg} padding="2" rounded="10">
              <Flex direction="row" align="center" justify="center" gap="10px">
                <Icon as={HiUser} />
                <Text>ID: {data?.participant1Code}</Text>
              </Flex>
            </Box>
            <Box bg={user2bg} padding="2" rounded="10">
              <Flex direction="row" align="center" justify="center" gap="10px">
                <Icon as={HiUser} />
                <Text>ID: {data?.participant2Code}</Text>
              </Flex>
            </Box>
          </Flex>
          <Spacer />
          <CircularProgress value={completionRate} size="70px" thickness="10px">
            <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
          </CircularProgress>
        </Flex>

        <VStack spacing="20px" mt={5}>
          {data?.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              userEmail={currentUserMail}
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
