import React, {useState} from 'react';

import _ from 'lodash';
/**
 * also:
 *  - state if form is submitting
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
  submitCb: (e: React.FormEvent<HTMLFormElement>, fields: IFieldState) => void,
  beforeSubmit?: (e: React.FormEvent<HTMLFormElement>, fields: IFieldState) => void
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

    if (beforeSubmit) beforeSubmit(e, fields);
    const canSubmit = validateSubmit()
    if (canSubmit) {
      submitCb(e, fields)
    }
  }

  /**
   * run onSubmit validations
   * @returns if all fields pass validation.
   */
  function validateSubmit(): boolean {
    const newFields = _.cloneDeep(fields)
    _.each(newFields, (fieldData, fieldName) => {
      const errors = initialFields[fieldName].submitValidations.map((validation) => {
        return validation(fieldData.value)
      }).filter((error) => !!error) as string[]
      fieldData.errors = errors
    })

    setFields(newFields)
    return canSubmit(newFields)
  }

  /**
   * form is in a valid state for submision
   */
  function canSubmit(fields: IFieldState): boolean {
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