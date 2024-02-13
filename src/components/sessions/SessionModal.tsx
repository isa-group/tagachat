/*eslint-disable*/
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
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
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
  const [sessions, setSessions] = useState([String])
  //onload get sessions
  const [session, setSession] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('/api/fetch')

        setSessions(response.data.data)
      } catch (error) {
      }
    }

    fetchSessions()
  }
  , [])  

  
  const onSubmit: SubmitHandler<FieldValues> = async (args) => {
    setIsLoading(true)
    axios.get(`/api/sessionData/${session}`)
    .then(function (response) {
      const data = response.data
      const twincodeData = getTwincodeData(data, session)
      console.log(twincodeData)
      axios.post(`/api/sessions`, {
        name: twincodeData.sessionName,
      })
      axios.post(`/api/rooms`, twincodeData.data)
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
      setIsLoading(false)
      
    })
    .catch(function (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 6000,
        position: 'top-right',
        isClosable: true,
      })
      setIsLoading(false)
    })

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
            <FormControl id="session" isInvalid={!!errors.url}>
          <FormLabel>Session</FormLabel>
            <Select placeholder="Select a session" size="lg" mb={6}
              onChange={(e) => {
                setSession(e.target.value)
              }}
            >
              {sessions.map((session: any) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </Select>
            
            <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="type">
            <FormLabel>Type of session</FormLabel>
            <Select placeholder="Select a type of session" size="lg" mb={6}
              onChange={(e) => {
                setType(e.target.value)
              }}
            >
              <option value="standard">Standard</option>
            </Select>
          </FormControl>
          <div style={{display: "block", width: 'auto', height:'auto', position:'absolute', top: '-12px', background:'#FAF089', color:'black', borderRadius: 5, padding: '2px 3px', fontSize: 12}}>
            At the day of today the only type of session available is standard, but we are working on adding custom sessions.
            </div>
          </form>


          {/*
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
            */
          }
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
