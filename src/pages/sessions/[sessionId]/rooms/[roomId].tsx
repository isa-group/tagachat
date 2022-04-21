import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import RadioCard from 'src/components/common/RadioCard'
import useFetch from 'src/hooks/useFetch'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'

const Message = ({ message }) => {
  const [tagFI, setTagFI] = useState('F')
  const [tagDT, setTagDT] = useState('S')

  function handleTagFIChange(e: string) {
    console.log(e)
    setTagFI(e)
  }

  function handleTagDTChange(e: string) {
    console.log(e)
    setTagDT(e)
  }

  return (
    <Box w="100%" h="auto" padding="10" bg="gray.50" rounded="10">
      <Flex height="100%" direction="row" align="center" justify="space-around">
        <Text>{message.message}</Text>

        <RadioGroup onChange={handleTagFIChange} value={tagFI}>
          <Stack direction={{ base: 'column', lg: 'row' }}>
            {tagFIOptions.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>

        <RadioGroup onChange={handleTagDTChange} value={tagDT}>
          <Stack direction={{ base: 'column', lg: 'row' }}>
            {tagDTOptions.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
    </Box>
  )
}

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

  return (
    <Box padding="8">
      <Heading>Room: {roomId} - messages</Heading>

      <Heading size="lg">First block</Heading>

      <CircularProgress value={completionRate} color="green.400">
        <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
      </CircularProgress>

      <VStack spacing={30} mt={5}>
        {data[0].first_block.messages.map((message, idx) => (
          <Message key={idx} message={message} />
        ))}
      </VStack>
    </Box>
  )
}

export default Room
