import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import LoadingSpinner from '../../common/LoadingSpinner'
import PasswordInput from '../PasswordInput'

type Inputs = {
  email: string
  name: string
  password: string
}

async function createUser({ email, name, password }: Inputs) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

function SignupForm() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      } else {
        setIsLoading(false)
      }
    })
  }, [router])

  const onSubmit: SubmitHandler<FieldValues> = async ({
    email,
    name,
    password,
  }) => {
    try {
      setIsLoading(true)

      await createUser({ email, name, password })

      toast({
        title: 'Contact with an administrator to activate your account',
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: (error as Error).message,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              {...register('email', {
                required: {
                  value: true,
                  message: 'Please enter an email address',
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {!errors.email ? (
              <FormHelperText>
                Enter your corporate email address
              </FormHelperText>
            ) : (
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl id="name" isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              autoComplete="name"
              {...register('name', {
                required: 'Please enter your name',
                minLength: 3,
                maxLength: 80,
              })}
            />
            {!errors.name ? (
              <FormHelperText>Enter your full name</FormHelperText>
            ) : (
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            )}
          </FormControl>

          <PasswordInput
            name="password"
            requiredMessage="Please enter a password"
            autoCompleteType="new-password"
            formLabel="Password"
            register={register}
            error={errors.password}
            formHelperText="At least 6 characters long"
            lenghtValidation
          />

          <Button type="submit" colorScheme="blue">
            Sign Up
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default SignupForm
