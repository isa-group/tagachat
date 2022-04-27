import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Heading,
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
      <Heading>Room: {roomId} - messages</Heading>

      <Heading size="lg">First block</Heading>

      <CircularProgress value={completionRate}>
        <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
      </CircularProgress>

      <VStack spacing={30} mt={5}>
        {data?.[0].first_block.messages.map((message) => (
          <Message key={message.id} setTags={setTags} {...message} />
        ))}
      </VStack>
    </Box>
  )
}

export default Room
