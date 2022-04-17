import { Box, Text } from '@chakra-ui/react'

const Footer = () => (
  <Box
    as="footer"
    position="absolute"
    bottom={0}
    role="contentinfo"
    mx="auto"
    maxW="7xl"
    py={{ base: '4', md: '12' }}
    px={{ base: '4', md: '8' }}
  >
    <Text fontSize="sm" alignSelf={{ base: 'center', sm: 'start' }}>
      &copy; {new Date().getFullYear()} tag-a-chat, Inc. All rights reserved.
    </Text>
  </Box>
)

export default Footer
