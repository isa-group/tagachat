import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import { IRoom } from 'src/types/room.type'

function getRoomPercentage(room: IRoom) {
  const totalMessages = room.messages.length

  // const result = room.messages.reduce((acc, curr) => acc.set(), new Map())

  const tagOcurrences = new Map()
  // reviso cada cuarto
  for (const message of room.messages) {
    // cuento si el usuario tiene tag
    for (const tag in message.tags) {
      tagOcurrences.set(tag, (tagOcurrences.get(tag) || 0) + 1)
    }
  }

  const result = Array.from(tagOcurrences.entries()).reduce((acc, curr) => {
    acc.push({
      tag: curr[0],
      percentage: Math.round((curr[1] / totalMessages) * 100),
    })
    return acc
  }, [] as { tag: string; percentage: number }[])

  return result
}

const Session = () => {
  const router = useRouter()
  const { sessionName } = router.query

  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.200', 'blue.800')

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IRoom[]>([])

  useEffect(() => {
    if (!router.isReady) return

    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions/${sessionName}/rooms`)
      setData(data)
      setIsLoading(false)
    }

    getData()
  }, [router.isReady, sessionName])

  if (isLoading) return <LoadingSpinner loading={isLoading} />

  return (
    <Box padding="8">
      <Heading>Session: {sessionName}</Heading>

      <Grid
        mt="40px"
        templateColumns="repeat(5, 1fr)"
        columnGap={8}
        rowGap={12}
        autoRows="1fr"
      >
        <GridItem colSpan={1} m="auto">
          <Heading size="lg">Room</Heading>
        </GridItem>
        <GridItem colSpan={2} m="auto">
          <Heading size="lg">Block 1</Heading>
        </GridItem>
        <GridItem colSpan={2} m="auto">
          <Heading size="lg">Block 2</Heading>
        </GridItem>

        {data.map((room) => {
          const getPercentages = getRoomPercentage(room)

          return (
            <Fragment key={room.roomCode}>
              <GridItem colSpan={1} m="auto">
                <Heading size="md">{room.roomCode}</Heading>
              </GridItem>

              <GridItem colSpan={2}>
                <Box
                  h="100%"
                  padding="10"
                  bg={bg}
                  boxShadow={'md'}
                  rounded={'lg'}
                  onClick={() =>
                    router.push(
                      `/sessions/${sessionName}/rooms/${room.roomCode}`
                    )
                  }
                  transition="all 0.2s"
                  _hover={{
                    bg: bgOnHover,
                    cursor: 'pointer',
                    boxShadow: 'xl',
                  }}
                >
                  {getPercentages.length > 0 ? (
                    getPercentages.map((percentage) => (
                      <Text key={percentage.tag}>
                        <strong>{percentage.tag}:</strong>{' '}
                        {percentage.percentage}%
                      </Text>
                    ))
                  ) : (
                    <Text>No tags</Text>
                  )}
                </Box>
              </GridItem>

              <GridItem colSpan={2}>
                <Box
                  padding="10"
                  h="100%"
                  bg={bg}
                  boxShadow={'md'}
                  rounded={'lg'}
                  onClick={() =>
                    router.push(
                      `/sessions/${sessionName}/rooms/${room.roomCode}`
                    )
                  }
                  transition="all 0.2s"
                  _hover={{
                    bg: bgOnHover,
                    cursor: 'pointer',
                    boxShadow: 'xl',
                  }}
                >
                  <Text>
                    <strong>Here goes second block logic</strong>
                  </Text>
                </Box>
              </GridItem>
            </Fragment>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Session
