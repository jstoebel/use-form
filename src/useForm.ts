import React, {useState} from 'react';

import _ from 'lodash';
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

// the interface to represent fields
interface BasicFields {
  [fieldName: string]: {
    value: string,
    validateOnSubmit: boolean
  }
}

// interface to represent the state of each field
interface IFieldState {
  [fieldName: string]: {
    value: string,
    errors: string[]
  }
}

const useForm = <IFields extends BasicFields>(
  initialFields: IFields,
  submitCb: (e: React.FormEvent<HTMLFormElement>, fields: IFieldState) => void
) => {

  // transform config object representing fields to a slimmer object mapping 
  const initialValues = _.transform(initialFields, (result, fieldData, fieldName) => {
    result[fieldName] = {value: fieldData.value, errors: []}
  }, {} as IFieldState)

  const [fields, setFields] = useState(initialValues)

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    // user supplied callback
    e.preventDefault();
    submitCb(e, fields)
  }

  function handleFieldChange(e: React.FormEvent<HTMLInputElement>) {
    const {value, name} = e.currentTarget
    const newFields = _.cloneDeep(fields)
    newFields[name].value = value
    setFields(newFields)
  }

  return {
    handleOnSubmit,
    handleFieldChange,
    fields
  }
}

export default useForm