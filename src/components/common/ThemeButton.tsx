import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

function ThemeButton(props) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button colorScheme="blue" onClick={toggleColorMode} {...props}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

export default ThemeButton
