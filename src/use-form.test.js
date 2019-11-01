import { renderHook, act } from '@testing-library/react-hooks'
import useForm from './use-form'

describe('useForm', () => {
  let e;
  let submitSpy;
  beforeEach(() => {
    e = {
      preventDefault: () => {},
      currentTarget: {
        name: 'firstName',
        value: 'myName'
      }
    }
    submitSpy = jest.fn();
  })
  test('sets up fields', () => {
    const hook = setupHook()
    expect(hook.current.fields).toEqual({
      firstName: {
        value: '',
        errors: []
      }
    })
  })

  test('handleFieldChange', () => {
    const hook = setupHook();

    const event = {
      currentTarget: {
        name: 'firstName',
        value: 'myName',
      },
    }

    act(() => {
      hook.current.handleFieldChange(event)
    })

    expect(hook.current.fields).toEqual({
      firstName: {
        value: 'myName',
        errors: []
      }
    })
  })

  describe('form submit', () => {
    it('submits on valid state', () => {
      const hook = setupHook(
        {
          startingValue: 'myName',
          submitCb: submitSpy,
          submitValidations: []
        }
      )
      act(() => {
        hook.current.handleOnSubmit(e)
      })

      // not sure how to assert assert the signature of the function passed in.
      expect(submitSpy).toHaveBeenCalledWith(e, hook.current.fields, expect.any(Function))
    })

    it('does not submit on invalid state', () => {
      const hook = setupHook({
        startingValue: '',
        submitCb: submitSpy,
        beforesubmit: () => {},
        submitValidations: [() => 'error message!']
      })

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(submitSpy).not.toHaveBeenCalled();
      expect(hook.current.fields).toEqual({
        firstName: {
          value: '',
          errors: ['error message!']
        }
      })
    })
  })


  describe('submit validations', () => {
    it('calls submit validators', () => {
      const validationSpy = jest.fn()
      const hook = setupHook(
        {submitValidations: [validationSpy]}
      )

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(validationSpy).toHaveBeenCalled()
    })

    it('updates errors', () => {
      const submitValidations = [
        () => 'my error',
        () => null
      ]

      const hook = setupHook(
        {submitValidations}
      )

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      const errors =  hook.current.fields.firstName.errors
      expect(errors).toEqual(['my error'])

    })
  })

  describe('change validations', () => {
    it('calls cahnge validators', () => {
      const validationSpy = jest.fn()
      const hook = setupHook(
        {changeValidations: [validationSpy]}
      )

      act(() => {
        hook.current.handleFieldChange(e)
      })

      expect(validationSpy).toHaveBeenCalled()
    })

    it('updates errors', () => {
      const changeValidations = [
        () => 'my error',
        () => null
      ]

      const hook = setupHook(
        {changeValidations}
      )

      act(() => {
        hook.current.handleFieldChange(e)
      })

      const errors =  hook.current.fields.firstName.errors
      expect(errors).toEqual(['my error'])

    })
  })

  describe('beforeSubmit', () => {
    it('calls function before submitting', () => {
      const beforesubmitSpy = jest.fn()
      const hook = setupHook({beforesubmit: beforesubmitSpy})

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(beforesubmitSpy).toHaveBeenCalledWith(e, hook.current.fields)
    })
  })

  describe('form state', () => {

    it('initializes as "fresh"', () => {
      const hook = setupHook();
      expect(hook.current.status).toEqual('fresh')
    })

    it('has state "submitting" when submitting', () => {
      const hook = setupHook({
        submitCb: (e, fields, done) => {}
      });

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(hook.current.status).toEqual('submitting');
    })

    it('has state "successful" when done callback given `true`', () => {
      const hook = setupHook({
        submitCb: (e, fields, done) => {
          done(true)
        }
      });

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(hook.current.status).toEqual('successful');
    })

    it('has state "failed" when done callback given `false`', () => {
      const hook = setupHook({
        submitCb: (e, fields, done) => {
          done(false)
        }
      });

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(hook.current.status).toEqual('failed');
    })
  })
})

function setupHook(options) {
  
  const defaults = {
    startingValue: '', 
    submitCb: (_e, _fields) => {},
    beforesubmit: (_e, _fields) => {},
    changeValidations: [],
    submitValidations: [],
  }

  const {startingValue, submitCb, changeValidations, submitValidations, beforesubmit} = Object.assign({}, defaults, options)

  const {result} = renderHook(() => {
    return useForm(
      {
        firstName: {
          value: startingValue,
          changeValidations,
          submitValidations,
        },
      },
      submitCb,
      beforesubmit
    )
  });

  return result;
}
