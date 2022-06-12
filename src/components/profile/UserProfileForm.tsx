import { Button, Stack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import PasswordInput from '../auth/PasswordInput'
import LoadingSpinner from '../common/LoadingSpinner'

function UserProfileForm() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>()

  const onSubmit: SubmitHandler<FieldValues> = async ({
    currentPassword,
    newPassword,
  }) => {
    try {
      setIsLoading(true)

      await axios.patch('/api/auth/change-password', {
        currentPassword,
        newPassword,
      })

      toast({
        title: 'Password reset correctly!',
        status: 'success',
        position: 'top-right',
        duration: 6000,
        isClosable: true,
      })

      reset()
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
          <PasswordInput
            name="currentPassword"
            requiredMessage="Please enter your current password"
            autoCompleteType="current-password"
            formLabel="Current password"
            register={register}
            error={errors.currentPassword}
          />

          <PasswordInput
            name="newPassword"
            requiredMessage="Please enter a new password"
            autoCompleteType="new-password"
            formLabel="New Password"
            register={register}
            error={errors.newPassword}
          />

          <Button type="submit" colorScheme="blue">
            Change Password
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default UserProfileForm
