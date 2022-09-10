import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { MouseEvent, useState } from 'react'
import { calculateKappa } from 'src/utils/getCohenKappa'

type KappaButtonProps = {
  sessionName: string
  roomCode?: string
  buttonSize: string
}

const KappaButton = ({
  sessionName,
  roomCode,
  buttonSize = 'xs',
}: KappaButtonProps) => {
  const [text, setText] = useState('Kappa (κ)')
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    setIsLoading(true)
    const kappa = await calculateKappa(e, sessionName, roomCode)

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
