import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Глобальные моки (пример)
vi.mock('axios')

afterEach(() => {
  cleanup()
})

// Активация нового поведения React 19
globalThis.IS_REACT_ACT_ENVIRONMENT = true
