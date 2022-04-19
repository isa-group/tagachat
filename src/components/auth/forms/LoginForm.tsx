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
import { useForm } from 'react-hook-form'

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

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      })

      console.log(result)

      if (!result.error) {
        toast({
          title: `Welcome to tag-a-chat!`,
          status: 'info',
          duration: 6000,
          isClosable: true,
        })

        router.replace('/')
      } else {
        toast({
          title: `${result?.error}`,
          status: 'error',
          duration: 6000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error(error)
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
                required: 'Please enter a valid email address',
                pattern: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>

          <PasswordInput
            name="password"
            requiredMessage="Please enter a password"
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
