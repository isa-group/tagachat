import { Box, Text } from '@chakra-ui/react'

const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    w="100%"
    marginTop="auto"
    p={{ base: '4', md: '12' }}
  >
    <Text fontSize="sm" alignSelf={{ base: 'center', sm: 'start' }}>
      &copy; {new Date().getFullYear()} tag-a-chat, Inc. All rights reserved.
    </Text>
  </Box>
)

export default Footer
