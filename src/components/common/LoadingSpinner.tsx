import { useEffect } from 'react'

import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'

function LoadingSpinner({ loading }: { loading: boolean }) {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
    if (!loading) onClose()
  }, [loading, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent maxW="120">
        <Flex justifyContent="center" alignItems="center">
          <Spinner margin="30" size="xl" colorScheme="blue" />
        </Flex>
      </ModalContent>
    </Modal>
  )
}

export default LoadingSpinner
