import React from 'react';
import useForm from './use-form'

const MyForm: React.FC = () => {

  const {handleOnSubmit, handleFieldChange, fields} = useForm(
    {
      name: {
        value: '',
        validateOnSubmit: true
      },
      email: {
        value: '',
        validateOnSubmit: true
      },
    },
    (e, fields) => {
      console.log('hello from consumer submit callback!', fields);
      
    }
  );
  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={fields.name.value} onChange={handleFieldChange} />
      </div>

      <div>
        <label>Email:</label>
        <input type="text" name="email" value={fields.email.value} onChange={handleFieldChange} />
      </div>

      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
}

export default MyForm;
