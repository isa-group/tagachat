import { CheckIcon, LockIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { IUser } from 'src/types/user.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

const Reviewer = ({ _id, email, isActive }: IUser) => {
  const [isReviewerActive, setIsReviewerActive] = useState(isActive)
  const toast = useToast()
  const bgColors = useColorModeValue('gray.200', 'gray.600')

  const updateReviewer = async (_id: string, isActive: boolean) => {
    try {
      const {
        data: {
          data: { value },
        },
      } = await axios.patch(`/api/users`, {
        _id,
        isActive: !isActive,
      })

      setIsReviewerActive(value.isActive)
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        status: 'error',
        duration: 5000,
        position: 'top-right',
        isClosable: true,
      })
    }
  }

  return (
    <Box w="100%" h="auto" paddingY="4" paddingX="8" bg={bgColors} rounded="10">
      <Flex height="100%" direction="row" align="center" gap="15px">
        <Text>{email}</Text>

        <Spacer />

        {isReviewerActive ? (
          <Button
            colorScheme="red"
            leftIcon={<LockIcon />}
            onClick={() => updateReviewer(_id, isReviewerActive)}
          >
            Block
          </Button>
        ) : (
          <Button
            colorScheme="green"
            leftIcon={<CheckIcon />}
            onClick={() => updateReviewer(_id, isReviewerActive)}
          >
            Activate
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Reviewer
