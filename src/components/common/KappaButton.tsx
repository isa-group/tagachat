import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { MouseEvent, useState } from 'react'
import { calculateKappa } from 'src/utils/calculateKappa'

const KappaButton = ({
  sessionName,
  buttonSize = 'xs',
}: {
  sessionName: string
  buttonSize: string
}) => {
  const [text, setText] = useState('Kappa (κ)')
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    setIsLoading(true)
    const kappa = await calculateKappa(e, sessionName)

    setText(`FI=${kappa?.fiCohen}; DT=${kappa?.dtCohen}`)
    setIsLoading(false)
  }

  return (
    <Button
      isLoading={isLoading}
      size={buttonSize}
      variant="outline"
      rightIcon={<QuestionOutlineIcon />}
      onClick={(e) => handleClick(e)}
    >
      {text}
    </Button>
  )
}

export default KappaButton
