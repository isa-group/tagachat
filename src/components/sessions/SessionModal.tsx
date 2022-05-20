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
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import getRoomChats from 'src/utils/getRoomChats'
import PasswordInput from '../auth/PasswordInput'
import LoadingSpinner from '../common/LoadingSpinner'

const SessionModal = ({ isOpen, onClose, setTwincodeData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const onSubmit: SubmitHandler<FieldValues> = async ({
    session,
    username,
    password,
  }) => {
    try {
      setIsLoading(true)

      const result = await fetch(
        `https://twincode-data.herokuapp.com/api/v1/datasets/standard/${session}/full`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              Buffer.from(username + ':' + password, 'utf8').toString('base64'),
          },
        }
      )
      const data = await result.json()
      console.log(data)
      console.log(getRoomChats(data))
      setTwincodeData(data)
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
        title: (error as Error).message,
        description: 'Session could not be loaded',
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
                <FormControl id="session" isInvalid={!!errors.session}>
                  <FormLabel>Session name</FormLabel>
                  <Input
                    type="text"
                    {...register('session', {
                      required: {
                        value: true,
                        message: 'Please enter a twincode session name',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.session?.message}</FormErrorMessage>
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
