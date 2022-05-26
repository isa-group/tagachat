import { Flex, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

type FloatingCardProps = {
  goToPage: () => void
}

const FloatingCard: FC<FloatingCardProps> = ({ children, goToPage }) => {
  const bg = useColorModeValue('gray.50', 'gray.700')
  const bgOnHover = useColorModeValue('gray.50', 'blue.800')

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="2rem"
      h="100%"
      padding="10"
      boxShadow="md"
      rounded="lg"
      bg={bg}
      _hover={{
        bg: bgOnHover,
        cursor: 'pointer',
        boxShadow: 'xl',
        transform: 'translateY(-3px)',
      }}
      transition="all 0.2s"
      onClick={() => goToPage()}
    >
      {children}
    </Flex>
  )
}

export default FloatingCard
