import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import useFetch from 'src/hooks/useFetch'

import { Select, OptionBase, GroupBase } from 'chakra-react-select'

interface TagOption extends OptionBase {
  value: string
  label: string
}

export const tagOptions = [
  { value: 'S', label: 'Statement of information or explanation' },
  { value: 'U', label: 'Opinion or indication of uncertainty' },
  { value: 'D', label: 'Explicit Instruction' },
]

const Room = () => {
  const router = useRouter()
  const { sessionId, roomId } = router.query

  const [completionRate, setCompletionRate] = useState(0)
  const [changedMessages, setChangedMessages] = useState(0)

  const { data, isLoading, isError } = useFetch(
    `http://localhost:3005/sessions/${sessionId}/rooms?id=${roomId}`
  )

  if (isLoading) return <LoadingSpinner loading={isLoading} />
  if (isError) return <div>failed to load</div>

  const roomData = data[0]

  function handleChange(tags) {
    if (tags.length > 0) {
      setChangedMessages(changedMessages + 1)
    } else {
      setChangedMessages(changedMessages - 1)
    }

    setCompletionRate(
      (changedMessages * 100) / data[0].first_block.messages.length
    )
  }

  return (
    <Box padding="8">
      <Heading>Room: {roomId}</Heading>

      <Heading size="lg">First block</Heading>

      <CircularProgress value={completionRate} color="green.400">
        <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
      </CircularProgress>

      <Heading size="md">Messages</Heading>

      <VStack spacing={30} mt={5}>
        {roomData.first_block.messages.map((message, idx) => (
          <Box
            key={idx}
            w="100%"
            h="70px"
            padding="10"
            bg="gray.50"
            rounded="10"
          >
            <Flex
              height="100%"
              direction="row"
              align="center"
              justify="space-around"
            >
              <Text>{message.message}</Text>
              <Text>{message.timestamp}</Text>

              <FormControl p={2} width="50%">
                <FormLabel>Select tags</FormLabel>
                <Select<TagOption, true, GroupBase<TagOption>>
                  isMulti
                  name="tags"
                  size="sm"
                  options={tagOptions}
                  placeholder="Select some tags..."
                  closeMenuOnSelect={false}
                  onChange={handleChange}
                />
              </FormControl>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default Room
