import { Box, useColorModeValue, useRadio } from '@chakra-ui/react'

export function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const brandColors = useColorModeValue('blue.500', 'blue.600')

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderColor={brandColors}
        _checked={{
          bg: brandColors,
          color: 'white',
        }}
        px={3}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  )
}
