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
    formState: { errors },
  } = useForm<FieldValues>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const onSubmit: SubmitHandler<FieldValues> = async ({
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
        sessions.find((session: { name: any }) => session.name === sessionName)
      ) {
        toast({
          title: 'Error',
          description: 'Session was already added',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })

        onClose()
        return
      }

      const { data } = await axios.get(
        `https://twincode-data.herokuapp.com/api/v1/datasets/standard/${sessionName}/full`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              Buffer.from(username + ':' + password, 'utf8').toString('base64'),
          },
        }
      )

      const twincodeData = getTwincodeData(data)

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
        isClosable: true,
      })

      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 6000,
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
        <ModalContent>
          <ModalHeader>Import a session from Twincode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="sessionform" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6}>
                <FormControl id="sessionName" isInvalid={!!errors.sessionName}>
                  <FormLabel>Session name</FormLabel>
                  <Input
                    type="text"
                    {...register('sessionName', {
                      required: {
                        value: true,
                        message: 'Please enter a twincode session name',
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
                  <FormErrorMessage>{errors.session?.message}</FormErrorMessage>
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
