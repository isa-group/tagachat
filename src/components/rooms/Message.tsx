import {
  Box,
  ButtonGroup,
  Flex,
  Spacer,
  Text,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IMessage } from 'src/types/message.type'
import { tagsDT, tagsFI } from 'src/types/tags.type'
import { UserRoles } from 'src/utils/enums/userRoles'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'
import RadioCard from '../common/RadioCard'
import TagComparison from './TagComparison'

type MessageProps = {
  backgroundColor: string
  sessionName: string | string[] | undefined
  roomCode: string | string[] | undefined
  message: IMessage
  userEmail: string
  setTaggedMessages: Dispatch<SetStateAction<IMessage[]>>
}

const Message = ({
  backgroundColor,
  sessionName,
  roomCode,
  userEmail,
  message,
  setTaggedMessages,
}: MessageProps) => {
  const toast = useToast()

  const [tags, setTags] = useState(message.tags)

  const [tempFI, setTempFI] = useState<tagsFI>()
  const [tempDT, setTempDT] = useState<tagsDT>()

  const { data: session } = useSession()

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      defaultValue: message?.tags?.[userEmail]?.tagFI,
      onChange: (tag) => setTempFI(tag),
    })

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      defaultValue: message?.tags?.[userEmail]?.tagDT,
      onChange: (tag) => setTempDT(tag),
    })

  useEffect(() => {
    if (!(tempFI && tempDT)) return

    async function checkIfTagged() {
      try {
        const {
          data: {
            data: { messages },
          },
        } = await axios.get(`/api/sessions/${sessionName}/rooms/${roomCode}`)

        const latestMessage = messages.find(
          (m: { id: number }) => m.id === message.id
        )

        const taggedMessage = {
          ...latestMessage,
          tags: {
            ...latestMessage.tags,
            [userEmail]: {
              tagFI: tempFI,
              tagDT: tempDT,
            },
          },
        }

        setTags(taggedMessage.tags)

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
        toast({
          title: 'Error',
          description: getErrorMessage(error),
          status: 'error',
          duration: 6000,
          position: 'top-right',
          isClosable: true,
        })
      }
    }

    checkIfTagged()
  }, [
    message.id,
    roomCode,
    sessionName,
    setTaggedMessages,
    tempDT,
    tempFI,
    toast,
    userEmail,
  ])

  return (
    <Box
      w="100%"
      h="auto"
      paddingY="4"
      paddingX="8"
      bg={backgroundColor}
      rounded="10"
    >
      <Flex
        height="100%"
        direction={{ base: 'column', xl: 'row' }}
        align="center"
        gap="15px"
      >
        <Text>{message.message}</Text>

        <Spacer />

        <Text fontSize="xs" mr="1rem">
          {message.timestamp}
        </Text>

        {session?.user.role === UserRoles.REVIEWER && (
          <>
            <ButtonGroup isAttached {...getRootFIProps()}>
              {tagFIOptions.map((value) => (
                <RadioCard
                  key={value}
                  tag={value}
                  {...getRadioFIProps({ value })}
                />
              ))}
            </ButtonGroup>

            <ButtonGroup isAttached {...getRootDTProps()}>
              {tagDTOptions.map((value) => (
                <RadioCard
                  key={value}
                  tag={value}
                  {...getRadioDTProps({ value })}
                />
              ))}
            </ButtonGroup>
          </>
        )}

        {tags &&
          (session?.user.role === UserRoles.ADMIN ||
            Object.keys(tags).includes(session?.user?.email ?? '')) &&
          Object.keys(tags).length >= 2 && <TagComparison tags={tags} />}
      </Flex>
    </Box>
  )
}

export default Message
