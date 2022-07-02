import { DownloadIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import FloatingCard from 'src/components/common/FloatingCard'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import SessionModal from 'src/components/sessions/SessionModal'
import { calculateKappa } from 'src/utils/calculateKappa'
import { downloadSessionData } from 'src/utils/downloadSessionData'

const SessionList: FC = (props) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(true)

  const [data, setData] = useState([])
  const [updateSessions, setUpdateSessions] = useState(false)

  const { data: session } = useSession()

  useEffect(() => {
    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions`)
      setData(data)
      setUpdateSessions(false)
      setIsLoading(false)
    }

    getData()
  }, [updateSessions])

  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="3rem">
      <HStack>
        <Heading>Sessions</Heading>
        <Spacer />

        {session?.user?.role === 'admin' && (
          <Button onClick={onOpen}>Import Session</Button>
        )}
      </HStack>

      <SessionModal
        isOpen={isOpen}
        onClose={onClose}
        setUpdateSessions={setUpdateSessions}
      />

      <SimpleGrid columns={[2, null, 3]} spacing="2rem" mt="3rem">
        {data.map((session: { _id: string; name: string }) => (
          <FloatingCard
            key={session._id}
            goToPage={() => router.push(`/sessions/${session.name}`)}
          >
            <Text fontSize="xl" fontWeight="bold">
              {session.name}
            </Text>

            <HStack>
              <Button
                size="xs"
                variant="outline"
                rightIcon={<DownloadIcon />}
                onClick={(event) => downloadSessionData(event, session.name)}
              >
                Download
              </Button>

              <Spacer />

              <Button
                size="xs"
                variant="ghost"
                leftIcon={<InfoOutlineIcon />}
                onClick={(event) => calculateKappa(event, session.name)}
              >
                κ
              </Button>
            </HStack>
          </FloatingCard>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default SessionList
