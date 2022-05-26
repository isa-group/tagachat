import {
  Text,
  CircularProgressLabel,
  HStack,
  CircularProgress,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { IRoom } from 'src/types/room.type'
import calculateRoomPercentage from 'src/utils/calculateRoomPercentage'
import FloatingCard from '../common/FloatingCard'

type PercentageFloatingCardProps = {
  block: 1 | 2
  room: IRoom
}

const PercentageFloatingCard: FC<PercentageFloatingCardProps> = ({
  block,
  room,
}) => {
  const router = useRouter()
  const percentages = calculateRoomPercentage(room.messages, block)

  return (
    <FloatingCard
      goToPage={() =>
        router.push(
          `/sessions/${room.sessionName}/rooms/${room.roomCode}?block=${block}`
        )
      }
    >
      {percentages.length > 0 ? (
        percentages.map((percentage) => (
          <HStack key={percentage.reviewer} justify="space-between">
            <Text fontWeight="bold">{percentage.reviewer}</Text>
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
  )
}

export default PercentageFloatingCard
