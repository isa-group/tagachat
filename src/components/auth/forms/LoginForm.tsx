import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { getSession, signIn } from 'next-auth/react'

import LoadingSpinner from '../../common/LoadingSpinner'
import PasswordInput from '../PasswordInput'

function LoginForm() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) router.push('/sessions')
    }

    checkSession()
  }, [router])

  const onSubmit: SubmitHandler<FieldValues> = async ({ email, password }) => {
    try {
      setIsLoading(true)

      const result = await signIn<'credentials'>('credentials', {
        redirect: false,
        email: email,
        password: password,
      })

      if (!!result && result.error) {
        throw new Error(result.error)
      } else {
        toast({
          title: `Welcome to tag-a-chat!`,
          status: 'info',
          duration: 6000,
          isClosable: true,
          position: 'top-right',
        })

        router.replace('/sessions')
      }
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
      <form aria-label="login" onSubmit={handleSubmit(onSubmit)}>
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
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <PasswordInput
            name="password"
            requiredMessage="Please enter a password"
            autoCompleteType="current-password"
            formLabel="Password"
            register={register}
            error={errors.password}
            linkText="Forgot Password?"
            linkHref="/reset-password"
          />

          <Button type="submit" colorScheme="blue">
            Log In
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default LoginForm
