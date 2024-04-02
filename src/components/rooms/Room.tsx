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
  useToast,
  Icon,
  Skeleton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { HiUser } from 'react-icons/hi'
import Message from 'src/components/rooms/Message'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'
import { UserRoles } from 'src/utils/enums/userRoles'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import KappaButton from '../common/KappaButton'
import { AIIcon } from '../common/AIIcon'

const Room: FC = () => {
  const router = useRouter()
  const { sessionName, roomCode, block } = router.query

  const toast = useToast()
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IRoom>()
  const [taggedMessages, setTaggedMessages] = useState<IMessage[]>([])
  const [predictedBlock, setPredictedBlock] = useState<Boolean>(false)
  const [completionRate, setCompletionRate] = useState(0)

  const { data: session } = useSession()
  const [currentUserMail, setCurrentUserMail] = useState('')
  const [progress, setProgress] = useState(0)
  const bg = useColorModeValue('white', 'gray.800')
  const user1bg = useColorModeValue('gray.200', 'gray.600')
  const user2bg = useColorModeValue('blue.300', 'blue.900')
  const [predictions, setPredictions] = useState<any[]>([])
  useEffect(() => {
    if (!(roomCode && sessionName && block)) return
    if (!session?.user) return
    if (typeof block !== 'string') return

    const { email } = session.user

    if (!email) return

    setCurrentUserMail(email)
    const getData = async () => {
      try {
        setLoading(true)

        const {
          data: { data },
        } = await axios.get(`/api/sessions/${sessionName}/rooms/${roomCode}`)

        const blockMessages = data.messages.filter(
          (message: IMessage) => message.block === parseInt(block)
        )

        setTaggedMessages(
          blockMessages.filter(
            (m: IMessage) => m?.tags?.[email]?.tagFI && m?.tags?.[email]?.tagDT
          ) ?? 0
        )

        setData({ ...data, messages: blockMessages })
      } catch (error) {
        toast({
          title: 'Error',
          description: getErrorMessage(error),
          status: 'error',
          duration: 6000,
          position: 'top-right',
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    const isPredicted = async () => {
      try {
        const {
          data: { isPredicted },
        } = await axios.get(
          `/api/ai/${sessionName}/${roomCode}/${block}`
        )

        if (!isPredicted) {
          setPredictedBlock(false)
        } else {
          setPredictedBlock(true)

          const {
            data: { prediction },
          } = await axios.get(
            `/api/ai/${sessionName}/${roomCode}/${block}/prediction`
          )

          if (prediction) {
            toast({
              title: 'AI Prediction',
              description: 'AI Prediction has been loaded for this block.',
              status: 'success',
              duration: 6000,
              position: 'top-right',
              isClosable: true,
            })
            setPredictions(prediction.prediction.messages)
          }

        }
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
    isPredicted()
    getData()
  }, [roomCode, sessionName, session?.user, toast, router, block])

  const makePrediction = async () => {
    setAiModalOpen(true)
    toast({
      title: 'AI Prediction',
      description: 'AI Prediction has been started for this block.',
      status: 'info',
      duration: 6000,
      position: 'top-right',
      isClosable: true,
    })
    try {

      const {
        data: { prediction },
      } = await axios.get(`/api/ai/${sessionName}/${roomCode}/${block}/prediction`)

      const interval = setInterval(async () => {
        try {
            const response = await axios.get(`/api/ai/${sessionName}/${roomCode}/${block}/prediction`);
            const { prediction } = response.data;
            const status = typeof prediction.prediction.status === 'number' ? parseFloat(prediction.prediction.status) : prediction.prediction.status;
            if (status === 'DONE' || (typeof status === 'number' && status > 90)) {
                clearInterval(interval);
                setAiModalOpen(false);
                setPredictedBlock(true);
                setPredictions(prediction.prediction.messages);
                toast({
                  title: 'AI Prediction',
                  description: 'AI Prediction has been completed for this block.',
                  status: 'success',
                  duration: 6000,
                  position: 'top-right',
                  isClosable: true,
                })
            }else{
              const statusNumeric = parseFloat(status);
              setProgress(parseFloat(statusNumeric.toFixed(2)));
            }

        } catch (error) {
            console.error('Error occurred while fetching prediction status:', error);
            clearInterval(interval);
        }
      }, 2000);

      

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


  useEffect(() => {
    if (!data) return

    const dataLength = data?.messages.length
    const taggedMessagesLength = taggedMessages?.length ?? 0

    setCompletionRate(Math.round((taggedMessagesLength / dataLength) * 100))
  }, [data, taggedMessages?.length])

  return (
    <Box padding="8">
      <Flex
        direction="row"
        align="center"
        justify="center"
        sx={{
          bg: bg,
          paddingY: '4',
          position: 'sticky',
          top: '0',
          zIndex: '1',
        }}
      >
        <VStack align="start">
          <Heading>Room {roomCode}</Heading>
          <Text fontSize="2xl">Block {block}</Text>
        </VStack>

        <Spacer />
        <Button variant="solid" leftIcon={<AIIcon />}
          background="#4caf50"
          color="white"
          _hover={{ background: "#43a047" }}
          _active={{ background: "#43a047" }}
          onClick={() => makePrediction()}
        >
          AI Prediction
        </Button>
        <Spacer />

        {sessionName &&
          roomCode &&
          typeof sessionName === 'string' &&
          typeof roomCode === 'string' && (
            <KappaButton
              sessionName={sessionName}
              roomCode={roomCode}
              buttonSize="md"
            />
          )}

        <Spacer />

        <Flex direction="row" align="center" justify="center" gap="30px">
          <Skeleton isLoaded={!loading}>
            <Box bg={user1bg} padding="2" rounded="10">
              <Flex direction="row" align="center" justify="center" gap="10px">
                <Icon as={HiUser} />
                <Text>ID: {data?.participant1Code}</Text>
              </Flex>
            </Box>
          </Skeleton>

          <Skeleton isLoaded={!loading}>
            <Box bg={user2bg} padding="2" rounded="10">
              <Flex direction="row" align="center" justify="center" gap="10px">
                <Icon as={HiUser} />
                <Text>ID: {data?.participant2Code}</Text>
              </Flex>
            </Box>
          </Skeleton>
        </Flex>

        {session?.user.role === UserRoles.REVIEWER && (
          <>
            <Spacer />
            <CircularProgress
              value={completionRate}
              size="70px"
              thickness="10px"
              isIndeterminate={loading}
            >
              <Skeleton isLoaded={!loading}>
                <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
              </Skeleton>
            </CircularProgress>
          </>
        )}
      </Flex>

      <VStack spacing="20px" mt={5}>
        {data
          ? data?.messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                userEmail={currentUserMail}
                sessionName={sessionName}
                roomCode={roomCode}
                setTaggedMessages={setTaggedMessages}
                backgroundColor={
                  data?.participant1Code === message.createdBy
                    ? user1bg
                    : user2bg
                }
                prediction={
                  predictions.find(
                    (prediction) => prediction.id === message.id
                  )
                }
              />
            ))
          : Array(16)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  w="100%"
                  height="4rem"
                  isLoaded={!loading}
                  key={index}
                />
              ))}
      </VStack>
      <Modal isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>AI Prediction</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            {
              predictedBlock ? (
                <Text>
                  <b>AI Prediction</b> has been completed for this block.
                </Text>
              ) : (<>
                <Text>
                <b>AI Prediction</b> is a feature that uses a <b>fine-tuned model</b> to predict the category of a message.
                
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                mt={2}
              >
                We are processing the data, to provide you with the prediction.
              </Text>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                
              }}>
              <Progress size="lg" 
                value={progress > 90 ? 100 : progress} 
                colorScheme={
                  progress > 90 ? 'green' : 'blue'
                }
                hasStripe
              isAnimated
                width={'100%'}
              /> 
              <Text ml={2}>{progress > 90 ? 100 : progress}%</Text>
              </div>
              {
                progress > 90 && (
                  <Button
                  mt={4}
                  onClick={
                    () => window.location.reload()
                  }
                >
                  Completed
                </Button>
                )
              }

              </>
              )
            }

          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Room
