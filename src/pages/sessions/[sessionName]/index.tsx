import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import FloatingCard from 'src/components/common/FloatingCard'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import { IRoom } from 'src/types/room.type'
import calculateRoomPercentage from 'src/utils/calculateRoomPercentage'

const Session = () => {
  const router = useRouter()
  const { sessionName } = router.query

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
    <Box padding="3rem">
      <Heading>Session: {sessionName}</Heading>

      <Grid
        mt="3rem"
        templateColumns="repeat(7, 1fr)"
        columnGap="2rem"
        rowGap="4rem"
        alignItems="center"
      >
        <GridItem colSpan={1} m="auto">
          <Heading size="lg">Room</Heading>
        </GridItem>
        <GridItem colSpan={3} m="auto">
          <Heading size="lg">Block 1</Heading>
        </GridItem>
        <GridItem colSpan={3} m="auto">
          <Heading size="lg">Block 2</Heading>
        </GridItem>

        {data.map((room) => {
          const getPercentages = calculateRoomPercentage(room)

          return (
            <Fragment key={room.roomCode}>
              <GridItem colSpan={1} m="auto">
                <Heading size="md">{room.roomCode}</Heading>
              </GridItem>

              <GridItem colSpan={3}>
                <FloatingCard
                  goToPage={() =>
                    router.push(
                      `/sessions/${sessionName}/rooms/${room.roomCode}`
                    )
                  }
                >
                  {getPercentages.length > 0 ? (
                    getPercentages.map((percentage) => (
                      <HStack key={percentage.tag} justify="space-between">
                        <Text fontWeight="bold">{percentage.tag}</Text>
                        <CircularProgress
                          value={percentage.percentage}
                          color="blue.400"
                          thickness="6px"
                        >
                          <CircularProgressLabel>
                            {percentage.percentage}%
                          </CircularProgressLabel>
                        </CircularProgress>
                      </HStack>
                    ))
                  ) : (
                    <Text>No tags</Text>
                  )}
                </FloatingCard>
              </GridItem>

              <GridItem colSpan={3}>
                <FloatingCard
                  goToPage={() =>
                    router.push(
                      `/sessions/${sessionName}/rooms/${room.roomCode}`
                    )
                  }
                >
                  <Text>
                    <strong>Here goes second block logic</strong>
                  </Text>
                </FloatingCard>
              </GridItem>
            </Fragment>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Session
