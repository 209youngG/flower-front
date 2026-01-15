import { describe, it, expect } from 'vitest'
import { formatCurrency, isValidEmail } from '../format'

describe('Utils: format', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('₩1,000')
    expect(formatCurrency(0)).toBe('₩0')
  })

  it('validates email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
  })
})
