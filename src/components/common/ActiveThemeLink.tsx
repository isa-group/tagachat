import Link from 'next/link'
import { useRouter } from 'next/router'
import { Link as ChakraLink, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

export const ActiveThemedLink: FC<{ href: string }> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter()
  const bgColor = useColorModeValue('blue.700', 'blue.500')

  const isCurrentPath = router.pathname === href

  return (
    <Link href={href} passHref>
      <ChakraLink
        px="2"
        py="2"
        rounded="md"
        _hover={{
          textDecoration: 'none',
          bg: bgColor,
        }}
        bg={isCurrentPath ? bgColor : ''}
        {...props}
      >
        {children}
      </ChakraLink>
    </Link>
  )
}
