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

const Session = () => {
  const router = useRouter()
  const { sessionName } = router.query
  const [isLoading, setIsLoading] = useState(true)

  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.200', 'blue.800')

  const [data, setData] = useState([])

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

        {data.map((room: { _id: string; roomCode: number }) => (
          <Box
            key={room._id}
            w="100%"
            h="150px"
            padding="10"
            bg={bg}
            rounded="10"
            onClick={() =>
              router.push(`/sessions/${sessionName}/rooms/${room.roomCode}`)
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
                <Text size="lg">{room.roomCode}</Text>
              </div>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default Session
