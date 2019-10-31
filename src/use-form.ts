import React, {useState} from 'react';

import _ from 'lodash';
/**
 * also:
 *  - validations,
 *    - on submit validation
 *    - each can decide if it wants to validate onChange and/or onSubmit
 *    - Use rails validations
 *  - user supplied callback for onSubmit which fires before submitting
 *  - user supplied callback for form submission response which provides the submit result
 *  - state if form is submitting
 * 
 */

// the interface to represent fields
interface BasicFields {
  [fieldName: string]: {
    value: string,
    submitValidations: ((fieldValue: string) => string | null)[]
    changeValidations: ((fieldValue: string) => string | null)[]
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

  const [fields, setFields] = useState(() => {
    // transform config object representing fields to a slimmer object mapping 
    return _.transform(initialFields, (result, fieldData, fieldName) => {
      result[fieldName] = {value: fieldData.value, errors: []}
    }, {} as IFieldState)
  })

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    // user supplied callback
    e.preventDefault();
    validateSubmit()

    if (canSubmit()) {
      submitCb(e, fields)
    } else {
      console.log('form is not valid for sumbission');
    }
  }

  /**
   * run onSubmit validations
   */
  function validateSubmit(): void {
    _.each(fields, (fieldData, fieldName) => {
      const errors = initialFields[fieldName].submitValidations.map((validation) => {
        return validation(fieldData.value)
      }).filter((error) => !!error) as string[]

      fieldData.errors = errors
    })
  }

  /**
   * form is in a valid state for submision
   */
  function canSubmit(): boolean {
    const errors = _.reduce(fields, (result, value, key) => result.concat(value.errors), [] as string[])
    return errors.length === 0
  }

  function handleFieldChange(e: React.FormEvent<HTMLInputElement>) {
    const {value, name} = e.currentTarget
    validateFieldChange(name);

    const newFields = _.cloneDeep(fields)
    newFields[name].value = value
    setFields(newFields)
  }

  function validateFieldChange(fieldName: string): void {
    _.each(fields, (fieldData, fieldName) => {
      const errors = initialFields[fieldName].changeValidations.map((validation) => {
        return validation(fieldData.value)
      }).filter((error) => !!error) as string[]

      fieldData.errors = errors
    })
  }

  return {
    handleOnSubmit,
    handleFieldChange,
    fields
  }
}

export default useForm