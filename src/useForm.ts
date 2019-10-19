import React, {useState} from 'react';
/**
 * also:
 *  - user supplied callback for onSubmit
 *  - validations,
 *    - on submit validation
 *    - each can decide if it wants to validate onChange and/or onSubmit
 *    - Use rails validations
 *  - user supplied callback for onChange
 *  - user supplied callback for form submission response.
 *  - state if form is submitting
 * 
 */
const useForm = <IFields>(
  initialValues: IFields,
  submitCb: (e: React.FormEvent<HTMLFormElement>, fields: IFields) => void
) => {

  const [fields, setFields] = useState(initialValues)

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    // user supplied callback
    e.preventDefault();
    submitCb(e, fields)
  }

  function handleFieldChange(e: React.FormEvent<HTMLInputElement>) {
    const {value, name} = e.currentTarget
    setFields({...fields, [name]: value})
  }

  return {
    handleOnSubmit,
    handleFieldChange,
    fields
  }
}

export default useForm