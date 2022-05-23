import { Box, useColorModeValue, useRadio } from '@chakra-ui/react'

type RadioCardProps = {
  tag: string
}

const RadioCard = ({ tag, ...radioProps }: RadioCardProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps)

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
        {tag}
      </Box>
    </Box>
  )
}

export default RadioCard
