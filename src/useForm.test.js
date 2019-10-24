import { renderHook, act } from '@testing-library/react-hooks'
import useForm from './useForm'

describe('useForm', () => {
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
    let e;
    let submitSpy;
    beforeEach(() => {
      e = {
        preventDefault: () => {}
      }
      submitSpy = jest.fn();
    })

    it('submits on valid state', () => {
      const hook = setupHook({startingValue: 'myName', submitCb: submitSpy})
      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(submitSpy).toHaveBeenCalledWith(e, hook.current.fields)
    })

    it('does not submit on invalid state', () => {
      const hook = setupHook({startingValue: '', submitCb: submitSpy})

      act(() => {
        hook.current.handleOnSubmit(e)
      })

      expect(submitSpy).not.toHaveBeenCalled();
      expect(hook.current.fields).toEqual({
        firstName: {
          value: '',
          errors: ['field is required']
        }
      })
    })
  })
})

function setupHook(options) {
  
  const defaults = {
    startingValue: '', 
    validateOnSubmit: true,
    submitCb: (_e, _fields) => {}
  }

  const {startingValue, validateOnSubmit, submitCb} = Object.assign({}, defaults, options)

  const {result} = renderHook(() => {
    return useForm(
      {
        firstName: {
          value: startingValue,
          validateOnSubmit
        },
      },
      submitCb
    )
  });

  return result;
}
