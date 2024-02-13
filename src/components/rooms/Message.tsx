import {
  Box,
  ButtonGroup,
  Flex,
  Spacer,
  Text,
  useRadioGroup,
  useToast,
  Spinner
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

  const [predictedTag, setPredictedTag] = useState<{[key: string]: number}>()
  const [predictedFormal, setPredictedFormal] = useState<boolean>()
  
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

  //   async function getAI(prompt: string) {
  //     //parse prompt to [{"role": "user", "content": prompt}],
  //     const response = await fetch("/api/ai", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt }),
  //     });
  //     return response.json();
  // }

  // useEffect(() => {
  //   getAI(message.message).then((response) => {
      
  //     //El mensaje devuelto por la IA es de la forma "Clasificación: formal, S"
  //     //Se debe parsear para obtener la clasificación y el protocolo
      
  //     response = response.choices[0].message.content.split(",")
  //     if(response[0].includes("informal")){
  //       setPredictedFormal(false)
  //       console.log(response[0])
  //     }else{
  //       setPredictedFormal(true)
  //       console.log(response[0])
  //     }
  //     //"Clasificación: formal, {'S': 0, 'U': 0, 'D': 0, 'SU': 0, 'ACK': 0, 'M': 0, 'QYN': 0, 'AYN': 0, 'QWH': 0, 'AWH': 0, 'FP': 0.99, 'FNON': 0, 'O': 0}"
  //     //It is splitted by ","
  //     //The first part is the classification
  //     //The second part is the dictionary
  //     //The dictionary is splitted by ":"
  //     //The first part is the key
  //     //The second part is the value
  //     //The value is splitted by ","
  //     //The first part is the value of the key
  //     //The second part is the value of the key
      
  //     //get the length response to know how many keys are
  //     //get the key and the value of the key
  //     response[1] = response[1].replace("{", "")
  //     response = response.map((value: string) => value.trim())
  //     const dict: {[key: string]: number} = {}
  //     for (let i = 1; i < response.length; i++) {
  //       if(response[i].includes("}")){
  //         response[i] = response[i].replace("}", "")
  //       }
  //       response[i] = response[i].replace("'", "")
  //       response[i] = response[i].replace("'", "")
  //       response[i] = response[i].split(":")
  //       response[i][1] = parseFloat(response[i][1])

  //       dict[response[i][0]] = response[i][1]

  //       console.log(response[i])
  //     }


  //       setPredictedTag(dict);
      

      
  //   });
  // }, [])

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
        {/* {
          !predictedFormal && !predictedTag && (
            <Spinner size="sm" color='green.500' />
          )
        } */}
        <Text>{message.message}</Text>

        <Spacer />

        <Text fontSize="xs" mr="1rem">
          {message.timestamp}
        </Text>

        {session?.user.role === UserRoles.REVIEWER && (
          <>
            <ButtonGroup isAttached {...getRootFIProps()}>
              {
                console.log(predictedFormal)
              }
              {tagFIOptions.map((value) => (
                  predictedFormal && value == 'F' ? (
                    <RadioCard
                      key={value}
                      tag={value}
                      predicted={true}
                      {...getRadioFIProps({ value })}
                    />
                  ) :        
                  (
                    !predictedFormal && value as string == 'I' ? (
                      <RadioCard
                        key={value}
                        tag={value}
                        predicted={true}
                        {...getRadioFIProps({ value })}
                      />
                    ) : (
                      <RadioCard
                        key={value}
                        tag={value}
                        predicted={false}
                        {...getRadioFIProps({ value })}
                      />
                    )
                  )
              
              ))}
            </ButtonGroup>

            <ButtonGroup isAttached {...getRootDTProps()}>

              {predictedTag && tagDTOptions.map((value) => (
                predictedTag ? (
                  <RadioCard
                    key={value}
                    tag={value}
                    predicted={predictedTag[value]}
                    {...getRadioDTProps({ value })}
                  />
                ) : (
                  <RadioCard
                    key={value}
                    tag={value}
                    predicted={0}
                    {...getRadioDTProps({ value })}
                  />
                )
                

              ))}
                {!predictedTag && tagDTOptions.map((value) => (

                  <RadioCard
                    key={value}
                    tag={value}
                    predicted={false}
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
