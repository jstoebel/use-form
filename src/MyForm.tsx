import React from 'react';
import useForm from './useForm'

const MyForm: React.FC = () => {

  const {handleOnSubmit, handleFieldChange, fields} = useForm({
    name: '',
    email: ''
  });
  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={fields.name} onChange={handleFieldChange} />
      </div>

      <div>
        <label>Email:</label>
        <input type="text" name="email" value={fields.email} onChange={handleFieldChange} />
      </div>

      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
}

export default MyForm;
