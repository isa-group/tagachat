import { Box, Heading, VStack, useToast, Skeleton } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Reviewer from 'src/components/users/Reviewer'
import { IUser } from 'src/types/user.type'
import { getErrorMessage } from 'src/utils/getErrorMessage'

const AdminPage = () => {
  const [data, setData] = useState<IUser[]>()
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)

        const {
          data: { data },
        } = await axios.get(`/api/users`)

        setData(data)
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

    getData()
  }, [toast])

  return (
    <Box padding="8">
      <Heading>Reviewers </Heading>

      <VStack spacing="20px" mt={5}>
        {data
          ? data?.map((reviewer) => (
              <Reviewer key={reviewer._id} {...reviewer} />
            ))
          : Array(16)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  w="100%"
                  height="4rem"
                  key={index}
                  isLoaded={!loading}
                />
              ))}
      </VStack>
    </Box>
  )
}

export default AdminPage
