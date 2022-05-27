import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import getTwincodeData from 'src/utils/getTwincodeData'
import PasswordInput from '../auth/PasswordInput'
import LoadingSpinner from '../common/LoadingSpinner'

type SessionModalProps = {
  isOpen: boolean
  onClose: () => void
  setUpdateSessions: React.Dispatch<React.SetStateAction<boolean>>
}

const SessionModal = ({
  isOpen,
  onClose,
  setUpdateSessions,
}: SessionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const onSubmit: SubmitHandler<FieldValues> = async ({
    url,
    sessionName,
    username,
    password,
  }) => {
    try {
      setIsLoading(true)

      const {
        data: { data: sessions },
      } = await axios.get('/api/sessions')

      if (
        url ===
        'https://twincode-data.herokuapp.com/api/v1/datasets/standard/TWINCODE_SESSION/full'
      ) {
        toast({
          title: 'Warning',
          description:
            'Please replace TWINCODE_SESSION with the name of the session',
          status: 'warning',
          duration: 5000,
          position: 'top-right',
          isClosable: true,
        })
        return
      }

      if (
        sessions.find((session: { name: any }) => session.name === sessionName)
      ) {
        toast({
          title: 'Warning',
          description: `Session ${sessionName} was already added`,
          status: 'warning',
          duration: 5000,
          position: 'top-right',
          isClosable: true,
        })
        return
      }

      const { data } = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(username + ':' + password, 'utf8').toString('base64'),
        },
      })

      const twincodeData = getTwincodeData(data, sessionName)

      await axios.post(`/api/sessions`, {
        name: twincodeData.sessionName,
      })

      await axios.post(`/api/rooms`, twincodeData.data)

      setUpdateSessions(true)

      toast({
        title: 'Success',
        description: 'Session loaded successfully',
        status: 'success',
        duration: 5000,
        position: 'top-right',
        isClosable: true,
      })

      reset()
      onClose()
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
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <LoadingSpinner loading={isLoading} />}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Import a session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="sessionform" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6}>
                <FormControl id="url" isInvalid={!!errors.url}>
                  <FormLabel>Endpoint URL</FormLabel>
                  <Input
                    type="url"
                    defaultValue="https://twincode-data.herokuapp.com/api/v1/datasets/standard/TWINCODE_SESSION/full"
                    {...register('url', {
                      required: {
                        value: true,
                        message: 'Please enter an url',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id="sessionName" isInvalid={!!errors.sessionName}>
                  <FormLabel>Session name</FormLabel>
                  <Input
                    type="text"
                    {...register('sessionName', {
                      required: {
                        value: true,
                        message: 'Please enter a session name',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.sessionName?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl id="username" isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username', {
                      required: {
                        value: true,
                        message: 'Please enter a username',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                </FormControl>

                <PasswordInput
                  name="password"
                  requiredMessage="Please enter a password"
                  autoCompleteType="current-password"
                  formLabel="Password"
                  register={register}
                  error={errors.password}
                />
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" type="submit" form="sessionform">
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SessionModal
