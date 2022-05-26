import {
  Text,
  CircularProgressLabel,
  HStack,
  CircularProgress,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { IRoom } from 'src/types/room.type'
import calculateRoomPercentage from 'src/utils/calculateRoomPercentage'
import FloatingCard from '../common/FloatingCard'
import { ArrowRightIcon } from '@chakra-ui/icons'

type PercentageFloatingCardProps = {
  block: 1 | 2
  room: IRoom
}

const PercentageFloatingCard: FC<PercentageFloatingCardProps> = ({
  block,
  room,
}) => {
  const router = useRouter()
  const { data: userSession } = useSession()

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
            <Text fontWeight="bold">
              {userSession?.user.email === percentage.reviewer ? (
                <>your progress</>
              ) : (
                <>{percentage.reviewer}</>
              )}
            </Text>
            <ArrowRightIcon h="10px" />
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
