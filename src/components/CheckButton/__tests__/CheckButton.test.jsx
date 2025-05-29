import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckButton from '../CheckButton'

describe('CheckButton', () => {
  it('renders children correctly', () => {
    render(<CheckButton>Check me</CheckButton>)
    expect(screen.getByText('Check me')).toBeInTheDocument()
  })

  it('applies important class when isImportant is true', () => {
    render(<CheckButton isImportant>Important button</CheckButton>)
    const button = screen.getByText('Important button')
    expect(button.className).toContain('important')
  })

  it('does not apply important class when isImportant is false', () => {
    render(<CheckButton isImportant={false}>Normal button</CheckButton>)
    const button = screen.getByText('Normal button')
    expect(button.className).not.toContain('important')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<CheckButton onClick={handleClick}>Clickable button</CheckButton>)
    const button = screen.getByText('Clickable button')
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<CheckButton onClick={handleClick} disabled>Disabled button</CheckButton>)
    const button = screen.getByText('Disabled button')
    
    expect(button).toBeDisabled()
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards additional props to button element', () => {
    render(
      <CheckButton data-testid="custom-button" aria-label="Custom button">
        Custom button
      </CheckButton>
    )
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })

  it('combines important class with base class', () => {
    render(<CheckButton isImportant>Combined classes button</CheckButton>)
    const button = screen.getByText('Combined classes button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('important')
  })
}) 