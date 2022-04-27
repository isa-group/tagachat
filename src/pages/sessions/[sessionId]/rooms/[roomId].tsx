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
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import Message from 'src/components/rooms/Message'
import useFetch from 'src/hooks/useFetch'
import { tagsFI, tagsDT } from 'src/types/tags.type'

const Room = () => {
  const router = useRouter()
  const { sessionId, roomId } = router.query

  const [completionRate, setCompletionRate] = useState(0)
  const [tags, setTags] = useState([])

  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.100', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')

  const { data, isLoading, isError } = useFetch(
    `http://localhost:3005/sessions/${sessionId}/rooms?id=${roomId}`
  )

  useEffect(() => {
    const dataLength = data?.[0].first_block.messages.length
    const responseLength = tags.length
    setCompletionRate(Math.round((responseLength / dataLength) * 100))
  }, [data, tags])

  if (isLoading) return <LoadingSpinner loading={isLoading} />
  if (isError) return <div>failed to load</div>

  return (
    <Box padding="8">
      <Flex
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
            <Text>User ID: {data[0].user1Id}</Text>
          </Box>
          <Box bg={user2bg} padding="2" rounded="10">
            <Text>User ID: {data[0].user2Id}</Text>
          </Box>
        </Flex>
        <Spacer />
        <CircularProgress value={completionRate}>
          <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
        </CircularProgress>
      </Flex>

      <VStack spacing="20px" mt={5}>
        {data?.[0].first_block.messages.map((message) => (
          <Message
            {...message}
            key={message.id}
            setTags={setTags}
            backgroundColor={
              data[0].user1Id === message.userId ? user1bg : user2bg
            }
          />
        ))}
      </VStack>
    </Box>
  )
}

export default Room
