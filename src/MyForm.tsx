import React from 'react';
import useForm from './use-form'
import validatesPresense from './validations/validates-presence'

const MyForm: React.FC = () => {

  const {handleOnSubmit, handleFieldChange, fields, status} = useForm(
    {
      name: {
        value: '',
        submitValidations: [validatesPresense()],
        changeValidations: []
      },
      email: {
        value: '',
        submitValidations: [validatesPresense()],
        changeValidations: []
      },
    },
    (e, fields, resolve) => {
      console.log('hello from consumer submit callback!', fields);
      console.log('pretending to wait for server');
      
      setTimeout(() => {
        console.log('bad response from server!');
        resolve(true)
      }, 2000);
    }
  );
  return (
    <form onSubmit={handleOnSubmit}>
      <h1>{`Form status: ${status}`}</h1>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={fields.name.value} onChange={handleFieldChange} />
        {fields.name.errors.map((error, i) => <span key={i}>{error}</span>)}
      </div>

      <div>
        <label>Email:</label>
        <input type="text" name="email" value={fields.email.value} onChange={handleFieldChange} />
        {fields.email.errors.map((error, i) => <span key={i}>{error}</span>)}
      </div>

      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
}

export default MyForm;
