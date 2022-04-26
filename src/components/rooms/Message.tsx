import {
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  useRadioGroup,
} from '@chakra-ui/react'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'
import { RadioCard } from '../common/RadioCard'

const Message = ({ message, handleChange }) => {
  const bg = useColorModeValue('gray.50', 'gray.700')

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      onChange: handleChange,
    })

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      onChange: handleChange,
    })

  return (
    <Box w="100%" h="auto" padding="10" bg={bg} rounded="10">
      <Flex height="100%" direction="row" align="center" justify="space-around">
        <Text>{message.message}</Text>

        <Stack
          {...getRootFIProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagFIOptions.map((value) => (
            <RadioCard key={value} {...getRadioFIProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>

        <Stack
          {...getRootDTProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagDTOptions.map((value) => (
            <RadioCard key={value} {...getRadioDTProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>
      </Flex>
    </Box>
  )
}

export default Message
