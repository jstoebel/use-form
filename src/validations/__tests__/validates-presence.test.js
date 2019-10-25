import validatesPresence from '../validates-presence'

describe('validatesPresence', () => {
  it('returns no error from truthy values', () => {
    const validator = validatesPresence()
    const result = validator('spam')
    expect(result).toBe(null)
  })


  it('returns an error with custom message', () => {
    
  })
  it('returns error from truthy values', () => {
    
  })
})