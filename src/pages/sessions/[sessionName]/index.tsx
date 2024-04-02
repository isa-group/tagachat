import { DownloadIcon, StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import KappaButton from 'src/components/common/KappaButton'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import PercentageFloatingCard from 'src/components/rooms/PercentageFloatingCard'
import { IRoom } from 'src/types/room.type'
import { downloadSessionData } from 'src/utils/downloadSessionData'


type PredictedList = {
  room: string,
  block: string,
}[]

const Session = () => {
  const router = useRouter()
  const { sessionName } = router.query

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IRoom[]>([])
  const [predicted, setPredicted] = useState<PredictedList>()
  useEffect(() => {
    if (!router.isReady) return

    const getData = async () => {
      const {
        data: { data },
      } = await axios.get(`/api/sessions/${sessionName}/rooms`)
      setData(data)
      setIsLoading(false)
    }

    const predictedRooms = async () => {
      const {
        data: { predicted },
      } = await axios.get(`/api/ai/${sessionName}`)
      setPredicted(predicted)
    }


    getData()
    predictedRooms()
  }, [router.isReady, sessionName])

  if (isLoading) return <LoadingSpinner loading={isLoading} />
  return (
    <Box padding="3rem">
      <HStack>
        <Heading>Session: {sessionName}</Heading>
        {typeof sessionName === 'string' && (
          <>
            <Spacer />
            <KappaButton sessionName={sessionName} buttonSize="md" />
            <Button
              variant="outline"
              rightIcon={<DownloadIcon />}
              onClick={(event) => downloadSessionData(event, sessionName)}
            >
              Download
            </Button>
          </>
        )}
      </HStack>

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
              <PercentageFloatingCard room={room} block={1} predicted={
                predicted?.some((p:any) => parseInt(p.room) === room.roomCode && p.block === '1') || false
              } />
            </GridItem>

            <GridItem colSpan={3}>
              <PercentageFloatingCard room={room} block={2} predicted={
                predicted?.some((p:any) => parseInt(p.room) === room.roomCode && p.block === '2') || false
              } />
            </GridItem>
          </Fragment>
        ))}
      </Grid>
    </Box>
  )
}

export default Session
