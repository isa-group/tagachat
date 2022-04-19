import { FC } from 'react'
import { Button, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const ThemeButton: FC = (props) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button colorScheme="blue" onClick={toggleColorMode} {...props}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

export default ThemeButton
