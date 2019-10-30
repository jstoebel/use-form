import validatesPresence from '../validates-presence'

describe('validatesPresence', () => {
  it('returns no error from truthy values', () => {
    const validator = validatesPresence()
    const result = validator('spam')
    expect(result).toBe(null)
  })

  it('returns error from truthy values', () => {
    const validator = validatesPresence()
    const result = validator('')
    expect(result).toEqual('value is required')
  })

  it('returns an error with custom message', () => {
    const customMessage = 'my custom message'
    const validator = validatesPresence(customMessage)
    const result = validator('')
    expect(result).toEqual(customMessage)
  })
})