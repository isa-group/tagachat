import { Box, Flex, Spacer, Stack, Text, useRadioGroup } from '@chakra-ui/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IMessage } from 'src/types/message.type'
import { tagsDT, tagsFI } from 'src/types/tags.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'
import RadioCard from '../common/RadioCard'

type MessageProps = {
  backgroundColor: string
  sessionName: string | string[] | undefined
  roomCode: string | string[] | undefined
  message: IMessage
  setTaggedMessages: Dispatch<SetStateAction<IMessage[]>>
}

const Message = ({
  backgroundColor,
  sessionName,
  roomCode,
  message,
  setTaggedMessages,
}: MessageProps) => {
  const [tempFI, setTempFI] = useState<tagsFI>()
  const [tempDT, setTempDT] = useState<tagsDT>()

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      defaultValue: message?.tagFI,
      onChange: (tag) => setTempFI(tag),
    })

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      defaultValue: message?.tagDT,
      onChange: (tag) => setTempDT(tag),
    })

  useEffect(() => {
    if (!(tempFI && tempDT)) return

    async function checkIfTagged() {
      try {
        const taggedMessage = { ...message, tagFI: tempFI, tagDT: tempDT }

        await axios.patch(`/api/sessions/${sessionName}/rooms/${roomCode}`, {
          taggedMessage,
        })

        setTaggedMessages((prevTaggedMessages) => [
          ...prevTaggedMessages.filter(
            (taggedMsg) => taggedMsg.id !== taggedMessage.id
          ),
          taggedMessage,
        ])
      } catch (error) {
        console.error(getErrorMessage(error))
      }
    }

    checkIfTagged()
  }, [message, roomCode, sessionName, setTaggedMessages, tempDT, tempFI])

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
        <Text>{message.message}</Text>

        <Spacer />

        <Stack
          {...getRootFIProps()}
          direction={{ base: 'column', xl: 'row' }}
          spacing="0"
        >
          {tagFIOptions.map((value) => (
            <RadioCard
              key={value}
              tag={value}
              {...getRadioFIProps({ value })}
            />
          ))}
        </Stack>

        <Stack
          {...getRootDTProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagDTOptions.map((value) => (
            <RadioCard
              key={value}
              tag={value}
              {...getRadioDTProps({ value })}
            />
          ))}
        </Stack>
      </Flex>
    </Box>
  )
}

export default Message
