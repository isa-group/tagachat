import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'

type TagComparisonProps = {
  tags: {
    [userEmail: string]: {
      tagFI: string
      tagDT: string
    }
  }
}

const TagComparison = ({ tags }: TagComparisonProps) => {
  console.log(tags)
  const convertedTags = Object.values(tags).map((tag) => tag)
  const sameTags = convertedTags.every(
    (tag) =>
      tag.tagFI === convertedTags[0].tagFI &&
      tag.tagDT === convertedTags[0].tagDT
  )

  return sameTags ? (
    <CheckCircleIcon color="green.500" />
  ) : (
    <WarningIcon color="yellow.400" />
  )
}

export default TagComparison
