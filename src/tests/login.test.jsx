import { render, screen } from '@testing-library/react'
import Login from 'src/pages/login'
import '@testing-library/jest-dom'

jest.mock('next-auth/react')

describe('Login page', () => {
  beforeEach(() => {
    render(<Login />)
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('renders a heading', () => {
    const heading = screen.getByRole('heading', {
      name: /Log In/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders a form', () => {
    const form = screen.getByRole('form', { name: /login/i })
    expect(form).toBeInTheDocument()
  })

  it('renders login page unchanged', () => {
    const { container } = render(<Login />)
    expect(container).toMatchSnapshot()
  })
})
