import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  useDisclosure,
  Flex,
  useColorModeValue,
  FormHelperText,
} from '@chakra-ui/react'
import Link from 'next/link'
import { HiEye, HiEyeOff } from 'react-icons/hi'

function PasswordInput({
  name,
  formLabel,
  requiredMessage,
  register,
  error,
  autoCompleteType = 'current-password',
  lenghtValidation = false,
  linkText,
  linkHref,
  formHelperText,
}) {
  const { isOpen, onToggle } = useDisclosure()
  const textColors = useColorModeValue('blue.500', 'blue.200')

  return (
    <FormControl id={name} isInvalid={!!error}>
      {linkText && linkHref ? (
        <Flex justify="space-between">
          <FormLabel>{formLabel}</FormLabel>
          <Link href={linkHref} passHref>
            <ChakraLink color={textColors} fontWeight="semibold" fontSize="sm">
              {linkText}
            </ChakraLink>
          </Link>
        </Flex>
      ) : (
        <FormLabel>{formLabel}</FormLabel>
      )}
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={isOpen ? 'text' : 'password'}
          autoComplete={autoCompleteType}
          {...register(name, {
            required: requiredMessage,
            minLength: lenghtValidation
              ? {
                  value: 6,
                  message: 'Your password should be at least 6 characters long',
                }
              : {},
          })}
        />
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onToggle}
          />
        </InputRightElement>
      </InputGroup>
      {!error && formHelperText ? (
        <FormHelperText>{formHelperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export default PasswordInput
