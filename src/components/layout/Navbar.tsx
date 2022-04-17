import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { forwardRef } from 'react'
import ThemeButton from '../common/ThemeButton'

// REMEMBER TO DELETE
const isAuthenticated = false
const user = {
  name: 'John Doe',
  profilePicture: 'https://randomuser.me/api/portraits/women/31.jpg',
}
// THIS TOO

const ActiveThemedLink = forwardRef(({ children, href, ...props }, ref) => {
  const router = useRouter()
  const isCurrentPath = router.pathname === href

  const bgColor = useColorModeValue('blue.700', 'blue.500')

  return (
    <ChakraLink
      px="2"
      py="2"
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: bgColor,
      }}
      bg={isCurrentPath && bgColor}
      ref={ref}
      {...props}
    >
      {children}
    </ChakraLink>
  )
})
ActiveThemedLink.displayName = 'ActiveThemedLink'

const NavLinks = ({ isLoggedIn }) => (
  <>
    <Link href="/" passHref>
      <ActiveThemedLink>Home Page</ActiveThemedLink>
    </Link>
    {isLoggedIn && (
      <>
        <Link href="/example" passHref>
          <ActiveThemedLink>Example page</ActiveThemedLink>
        </Link>
      </>
    )}
  </>
)

export default function Navbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const menuTextColor = useColorModeValue('gray.700', 'white')
  const brandColors = useColorModeValue('blue.500', 'blue.700')

  return (
    <Box as="nav" bg={brandColors} color="white" px="4" {...props}>
      <Flex h="14" alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          bg={brandColors}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={isOpen ? 'opened menu' : 'closed menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing="12" alignItems="center">
          <Link href="/" passHref>
            <Heading
              as="h1"
              fontSize={{ base: '18px', md: '26px' }}
              letterSpacing={'tighter'}
              cursor="pointer"
            >
              tag-a-chat
            </Heading>
          </Link>

          <HStack spacing="10" display={{ base: 'none', md: 'flex' }}>
            <NavLinks isLoggedIn={isAuthenticated} />
          </HStack>
        </HStack>

        <HStack spacing="5">
          <ThemeButton />
          {isAuthenticated ? (
            <Box>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar size="sm" name={user?.name} />
                </MenuButton>

                <MenuList
                  zIndex="popover"
                  alignItems="center"
                  color={menuTextColor}
                >
                  <VStack spacing="4" my="5">
                    <Avatar size="xl" name={user?.name} />
                    <Text>{user.name}</Text>
                  </VStack>
                  <MenuDivider />
                  <MenuItem>
                    <Link href="/profile" passHref>
                      <a style={{ display: 'inline-block', width: '100%' }}>
                        My profile
                      </a>
                    </Link>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={
                      () => console.log('LOL')
                      // router
                      //   .replace('/')
                      //   .then(() => dispatch({ type: 'LOGOUT' }))
                    }
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ) : (
            <>
              <Link href="/signup" passHref>
                <Button
                  variant="outline"
                  _hover={{ color: 'blue.500', bg: 'white' }}
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button colorScheme="blue">Log In</Button>
              </Link>
            </>
          )}
        </HStack>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack spacing={4}>
            <NavLinks isLoggedIn={isAuthenticated} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}
