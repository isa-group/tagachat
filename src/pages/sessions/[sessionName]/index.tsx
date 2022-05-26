import { Box, Grid, GridItem, Heading } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import PercentageFloatingCard from 'src/components/rooms/PercentageFloatingCard'
import { IRoom } from 'src/types/room.type'

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

        {data.map((room) => (
          <Fragment key={room.roomCode}>
            <GridItem colSpan={1} m="auto">
              <Heading size="md">{room.roomCode}</Heading>
            </GridItem>

            <GridItem colSpan={3}>
              <PercentageFloatingCard room={room} block={1} />
            </GridItem>

            <GridItem colSpan={3}>
              <PercentageFloatingCard room={room} block={2} />
            </GridItem>
          </Fragment>
        ))}
      </Grid>
    </Box>
  )
}

export default Session
