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

      expect(submitSpy).toHaveBeenCalledWith(e, hook.current.fields)
    })

    it('does not submit on invalid state', () => {
      const hook = setupHook({
        startingValue: '',
        submitCb: submitSpy,
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

})

function setupHook(options) {
  
  const defaults = {
    startingValue: '', 
    submitCb: (_e, _fields) => {},
    changeValidations: [],
    submitValidations: [],
  }

  const {startingValue, submitCb, changeValidations, submitValidations} = Object.assign({}, defaults, options)

  const {result} = renderHook(() => {
    return useForm(
      {
        firstName: {
          value: startingValue,
          changeValidations,
          submitValidations,
        },
      },
      submitCb
    )
  });

  return result;
}
