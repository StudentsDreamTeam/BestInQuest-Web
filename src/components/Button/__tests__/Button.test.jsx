import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    render(<Button isActive>Active button</Button>)
    const button = screen.getByText('Active button')
    expect(button.className).toContain('active')
  })

  it('applies secondary class when variant is secondary', () => {
    render(<Button variant="secondary">Secondary button</Button>)
    const button = screen.getByText('Secondary button')
    expect(button.className).toContain('secondary')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>)
    const button = screen.getByText('Disabled button')
    expect(button).toBeDisabled()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Clickable button</Button>)
    const button = screen.getByText('Clickable button')
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick} disabled>Disabled button</Button>)
    const button = screen.getByText('Disabled button')
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards additional props to button element', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Custom button
      </Button>
    )
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })

  it('combines multiple classes correctly', () => {
    render(
      <Button isActive variant="secondary">
        Multi-class button
      </Button>
    )
    const button = screen.getByText('Multi-class button')
    expect(button.className).toContain('active')
    expect(button.className).toContain('secondary')
  })
}) 