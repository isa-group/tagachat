import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
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
import { FC } from 'react'
import { signOut, useSession } from 'next-auth/react'
import ThemeButton from '../common/ThemeButton'
import LoadingSpinner from '../common/LoadingSpinner'
import { ActiveThemedLink } from '../common/ActiveThemeLink'

const NavLinks = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <>
    {isLoggedIn && (
      <ActiveThemedLink href="/sessions">Sessions</ActiveThemedLink>
    )}
  </>
)

const Navbar: FC = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: session, status } = useSession()

  const menuTextColor = useColorModeValue('gray.700', 'white')
  const brandColors = useColorModeValue('blue.500', 'blue.700')

  return (
    <>
      {status === 'loading' && (
        <LoadingSpinner loading={status === 'loading'} />
      )}
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
            <Link href="/sessions" passHref>
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
              <NavLinks isLoggedIn={status === 'authenticated'} />
            </HStack>
          </HStack>

          <HStack spacing="5">
            <ThemeButton />
            {session ? (
              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    {session?.user?.name && (
                      <Avatar size="sm" name={session?.user?.name} />
                    )}
                  </MenuButton>

                  <MenuList
                    zIndex="popover"
                    alignItems="center"
                    color={menuTextColor}
                  >
                    <VStack spacing="4" my="5">
                      {session?.user?.name && (
                        <>
                          <Avatar size="xl" name={session.user.name} />
                          <Text>{session.user.name}</Text>
                        </>
                      )}
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
                    <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
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
              <NavLinks isLoggedIn={!!session} />
            </Stack>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Navbar
