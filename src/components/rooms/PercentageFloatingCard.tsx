import {
  Text,
  CircularProgressLabel,
  HStack,
  CircularProgress,
} from '@chakra-ui/react'
import { FC } from 'react'
import FloatingCard from '../common/FloatingCard'

type PercentageFloatingCardProps = {
  getPercentages: { reviewer: string; percentage: number }[]
  goToPage: any
}

const PercentageFloatingCard: FC<PercentageFloatingCardProps> = ({
  getPercentages,
  goToPage,
}) => {
  return (
    <FloatingCard goToPage={goToPage}>
      {getPercentages.length > 0 ? (
        getPercentages.map((percentage) => (
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
