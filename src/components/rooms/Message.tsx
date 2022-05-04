import { Box, Flex, Spacer, Stack, Text, useRadioGroup } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { tagDTOptions, tagFIOptions } from 'src/utils/tagOptions'
import { RadioCard } from '../common/RadioCard'

type MessageProps = {
  id: number
  backgroundColor: string
  message: string
  tagFI: string
  tagDT: string
  userId: number
  setTags: (tags: string[]) => void
}

const Message = ({
  id,
  backgroundColor,
  message,
  userId,
  setTags,
  tagFI,
  tagDT,
}: MessageProps) => {
  const [selectedTags, setSelectedTags] = useState({
    id,
    userId,
    message,
    tagFI: tagFI ? tagFI : '',
    tagDT: tagDT ? tagDT : '',
  })

  useEffect(() => {
    if (selectedTags.tagFI === '' || selectedTags.tagDT === '') return

    setTags((tags) => [
      ...tags.filter((tag) => tag.id !== selectedTags.id),
      { ...selectedTags },
    ])
  }, [id, selectedTags, setTags])

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      defaultValue: tagFI,
      onChange: (tag) => {
        setSelectedTags((tags) => ({ ...tags, tagFI: tag }))
      },
    })

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      defaultValue: tagDT,
      onChange: (tag) => {
        setSelectedTags((tags) => ({ ...tags, tagDT: tag }))
      },
    })

  return (
    <Box
      w="100%"
      h="auto"
      paddingY="4"
      paddingX="10"
      bg={backgroundColor}
      rounded="10"
    >
      <Flex height="100%" direction="row" align="center" gap="25px">
        <Text>{message}</Text>

        <Spacer />

        <Stack
          {...getRootFIProps()}
          direction={{ base: 'column', xl: 'row' }}
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
