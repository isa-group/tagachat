import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
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
  const onlyTags = Object.values(tags)
  const sameTags = onlyTags.every(
    (tag) => tag.tagFI === onlyTags[0].tagFI && tag.tagDT === onlyTags[0].tagDT
  )

  return (
    <Popover trigger="hover" placement="left">
      <PopoverTrigger>
        {sameTags ? (
          <CheckCircleIcon color="green.500" />
        ) : (
          <WarningIcon color="yellow.400" />
        )}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <TableContainer overflowX="hidden">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Reviewer</Th>
                  <Th>FI</Th>
                  <Th>DT</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(tags).map(([userEmail, tags]) => (
                  <Tr key={userEmail}>
                    <Td>{userEmail}</Td>
                    <Td>{tags.tagFI}</Td>
                    <Td>{tags.tagDT}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default TagComparison
