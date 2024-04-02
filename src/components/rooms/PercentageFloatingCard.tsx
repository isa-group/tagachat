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
import { ArrowRightIcon, StarIcon } from '@chakra-ui/icons'
import { AIIcon } from '../common/AIIcon'

type PercentageFloatingCardProps = {
  block: 1 | 2
  room: IRoom,
  predicted?: boolean
}

const PercentageFloatingCard: FC<PercentageFloatingCardProps> = ({
  block,
  room,
  predicted,
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
            {
              predicted && (
                <p
                style={{
                  padding: '10px 10px',
                  backgroundColor: '#4caf50',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  gap: '5px',
                }}
              >
                <AIIcon
                  color="white"
      
                />
              </p>
              )
            }
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
      ) : (<>
      <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
        {
          predicted && (
        
        <p
          style={{
            padding: '5px 10px',
            backgroundColor: '#4caf50',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            gap: '5px',
          }}
        >
          <AIIcon
            color="white"

          />
          AI Predicted
        </p>
        )
        }
        <Text>No tags</Text>
      </div>
        </>
      )}
    </FloatingCard>
  )
}

export default PercentageFloatingCard
