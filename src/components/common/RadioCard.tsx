import { Button, useColorModeValue, useRadio } from '@chakra-ui/react'

type RadioCardProps = {
  tag: string
}

const RadioCard = ({ tag, ...radioProps }: RadioCardProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps)

  const brandColors = useColorModeValue('blue.500', 'blue.600')

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Button
      size="sm"
      as="label"
      cursor="pointer"
      {...checkbox}
      _checked={{
        bg: brandColors,
        color: 'white',
      }}
    >
      {tag}
      <input {...input} />
    </Button>
  )
}

export default RadioCard
