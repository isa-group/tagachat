import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSession } from 'next-auth/react'
import Navbar from 'src/components/layout/Navbar'

jest.mock('next-auth/react')

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }
  },
}))

describe('Navbar Component', () => {
  it('shows Log Out button when logged in', async () => {
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()

    expect(screen.queryByText('Log In')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()

    const logoutButton = await screen.findByText('Log Out')
    expect(logoutButton).toBeInTheDocument()
  })
})
