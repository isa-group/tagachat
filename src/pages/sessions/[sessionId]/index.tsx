import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import useFetch from 'src/hooks/useFetch'

const Session = () => {
  const router = useRouter()
  const { sessionId } = router.query
  const [isLoading, setIsLoading] = useState(true)

  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.200', 'blue.800')

  const [data, setData] = useState([])

  useEffect(() => {
    if (!router.isReady) return

    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions/${sessionId}/rooms`)
      setData(data)
      setIsLoading(false)
    }

    getData()
  }, [router.isReady, sessionId])

  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="8">
      <Heading>Session: {sessionId}</Heading>

      <VStack spacing={30} mt={5}>
        <Box w="100%" h="70px" padding="10" rounded="10">
          <Flex
            height="100%"
            direction="row"
            align="center"
            justify="space-between"
          >
            <Heading size="lg">Room</Heading>
            <Heading size="lg">Block 1</Heading>
            <Heading size="lg">Block 2</Heading>
          </Flex>
        </Box>

        {data.map((room) => (
          <Box
            key={room._id}
            w="100%"
            h="150px"
            padding="10"
            bg={bg}
            rounded="10"
            onClick={() =>
              router.push(`/sessions/${sessionId}/rooms/${room._id}`)
            }
            _hover={{
              bg: bgOnHover,
              cursor: 'pointer',
            }}
          >
            <Flex
              height="100%"
              direction="row"
              align="center"
              justify="space-between"
              grow="1"
              shrink="1"
              basis="0"
            >
              <div>
                <Text size="lg">{room._id}</Text>
              </div>
              <div>
                <Text>
                  Reviewer 1: {room.first_block.reviewer1CompletionRate}%
                </Text>
                <Text>
                  Reviewer 2: {room.first_block.reviewer2CompletionRate}%
                </Text>
                {room.first_block.reviewer1CompletionRate +
                  room.first_block.reviewer2CompletionRate !==
                100 ? (
                  <Text>
                    Missing Percentage:{' '}
                    {100 -
                      room.first_block.reviewer1CompletionRate -
                      room.first_block.reviewer2CompletionRate}
                    %
                  </Text>
                ) : (
                  <Text>Completed!</Text>
                )}
              </div>
              <div>
                <Text>
                  Reviewer 1: {room.second_block.reviewer1CompletionRate}%
                </Text>
                <Text>
                  Reviewer 2: {room.second_block.reviewer2CompletionRate}%
                </Text>
                {room.second_block.reviewer1CompletionRate +
                  room.second_block.reviewer2CompletionRate !==
                100 ? (
                  <Text>
                    Missing Percentage:{' '}
                    {100 -
                      room.second_block.reviewer1CompletionRate -
                      room.second_block.reviewer2CompletionRate}
                    %
                  </Text>
                ) : (
                  <Text>Completed :)</Text>
                )}
              </div>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default Session
