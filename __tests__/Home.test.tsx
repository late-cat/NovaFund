import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders the hero section correctly', () => {
    render(<Home />)
    
    // Check if the main heading is present
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Fund the future on/i)
    
    // Check if the CTA link is present
    const link = screen.getByRole('link', { name: /Start a Campaign/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/create')
  })
})
