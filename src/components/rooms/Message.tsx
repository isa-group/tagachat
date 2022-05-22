import { Box, Flex, Spacer, Stack, Text, useRadioGroup } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'
import { RadioCard } from '../common/RadioCard'

type MessageProps = {
  backgroundColor: string
  sessionName: string | string[] | undefined
  roomCode: string | string[] | undefined
  id: number
  message: string
  timestamp: string
  createdBy: string
  tagFI: string
  tagDT: string
}

const Message = ({
  backgroundColor,
  sessionName,
  roomCode,
  id,
  createdBy,
  message,
  timestamp,
  tagFI,
  tagDT,
}: MessageProps) => {
  const [taggedMessage, setTaggedMessage] = useState({
    id,
    createdBy,
    message,
    timestamp,
    tagFI: tagFI || '',
    tagDT: tagDT || '',
  })

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      defaultValue: tagFI,
      onChange: (tag) => {
        setTaggedMessage((tags) => ({ ...tags, tagFI: tag }))
      },
    })

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      defaultValue: tagDT,
      onChange: (tag) => {
        setTaggedMessage((tags) => ({ ...tags, tagDT: tag }))
      },
    })

  useEffect(() => {
    if (!(sessionName && roomCode)) return

    if (taggedMessage.tagFI === '' || taggedMessage.tagDT === '') return

    const updateRoom = async () => {
      try {
        await axios.patch(`/api/sessions/${sessionName}/rooms/${roomCode}`, {
          taggedMessage,
        })
      } catch (error) {
        console.error(getErrorMessage(error))
      }
    }

    updateRoom()
  }, [roomCode, sessionName, taggedMessage])

  return (
    <Box
      w="100%"
      h="auto"
      paddingY="4"
      paddingX="10"
      bg={backgroundColor}
      rounded="10"
    >
      <Flex height="100%" direction="row" align="center" gap="25px">
        <Text>{message}</Text>

        <Spacer />

        <Stack
          {...getRootFIProps()}
          direction={{ base: 'column', xl: 'row' }}
          spacing="0"
        >
          {tagFIOptions.map((value) => (
            <RadioCard key={value} {...getRadioFIProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>

        <Stack
          {...getRootDTProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagDTOptions.map((value) => (
            <RadioCard key={value} {...getRadioDTProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>
      </Flex>
    </Box>
  )
}

export default Message
