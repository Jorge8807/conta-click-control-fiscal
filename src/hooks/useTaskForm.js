import { useState } from 'react';

export function useTaskForm(
  initialValues = {
    client: '',
    serviceType: 'declaration',
    description: '',
    priority: 'medium',
    dueDate: ''
  }
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!values.client.trim()) {
      nextErrors.client = 'El cliente es obligatorio.';
    }

    if (!values.description.trim()) {
      nextErrors.description = 'La descripcion es obligatoria.';
    }

    if (values.client.trim().length > 80) {
      nextErrors.client = 'El cliente debe tener maximo 80 caracteres.';
    }

    if (values.description.trim().length > 180) {
      nextErrors.description = 'La descripcion debe tener maximo 180 caracteres.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function reset() {
    setValues({
      client: '',
      serviceType: 'declaration',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
  }

  return {
    values,
    errors,
    updateField,
    validate,
    reset
  };
}
