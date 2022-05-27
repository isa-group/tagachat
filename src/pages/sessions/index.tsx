import { DownloadIcon } from '@chakra-ui/icons'
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
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import FloatingCard from 'src/components/common/FloatingCard'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import SessionModal from 'src/components/sessions/SessionModal'
import { IMessage } from 'src/types/message.type'
import { IRoom } from 'src/types/room.type'

function convertData(rooms: IRoom[]) {
  let headers =
    'session,room,participant,block,messageId,reviewer,tagFI,tagDT\n'

  rooms.forEach((room: IRoom) => {
    const { sessionName, roomCode, messages } = room

    messages.forEach((loopMessage: IMessage) => {
      const { createdBy, block, id, tags } = loopMessage

      for (const reviewer in tags) {
        headers += `${sessionName},${roomCode},${createdBy},${block},${id},${reviewer},${tags[reviewer].tagFI},${tags[reviewer].tagDT}\n`
      }
    })
  })

  return headers

  // const result = rooms.map((room: IRoom) => {
  //   const epic = room.messages.map((message: IMessage) => {
  //     const tags = []
  //     for (const reviewer in message.tags) {
  //       tags.push(
  //         [
  //           room.sessionName,
  //           room.roomCode,
  //           message.createdBy,
  //           message.block,
  //           message.message,
  //           reviewer,
  //           message.tags[reviewer].tagFI,
  //           message.tags[reviewer].tagDT,
  //         ].join(',')
  //       )
  //     }

  //     return tags
  //   })

  //   return epic
  // })

  // const newData = headers + data.map((room: any[]) => room.join(',')).join('\n')

  // return newData
}

async function downloadSessionData(
  e: React.MouseEvent<HTMLButtonElement>,
  sessionName: string
) {
  e.stopPropagation()

  try {
    const {
      data: { data },
    } = await axios.get(`/api/sessions/${sessionName}/rooms`)

    const csv = convertData(data)

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${sessionName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error(error)
  }
}

const SessionList: FC = (props) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(true)

  const [data, setData] = useState([])
  const [updateSessions, setUpdateSessions] = useState(false)

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
        <Button onClick={onOpen}>Import Session</Button>
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

            <Button
              size="xs"
              variant="outline"
              rightIcon={<DownloadIcon />}
              onClick={(event) => downloadSessionData(event, session.name)}
            >
              Download
            </Button>
          </FloatingCard>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default SessionList
