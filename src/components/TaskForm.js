import { memo } from 'react';
import { serviceTypes } from '../context/TaskContext';
import { useTaskForm } from '../hooks/useTaskForm';
import styles from './TaskForm.module.css';

function TaskForm({
  initialValues = {
    client: '',
    serviceType: 'declaration',
    description: '',
    priority: 'medium',
    dueDate: ''
  },
  submitLabel = 'Agregar tarea',
  onSubmit
}) {
  const { values, errors, updateField, validate, reset } = useTaskForm(initialValues);

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(values);

    if (submitLabel === 'Agregar tarea') {
      reset();
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="client">Cliente</label>
      <input
        id="client"
        name="client"
        type="text"
        value={values.client}
        onChange={updateField}
        placeholder="Ej. Conta Click"
        aria-invalid={Boolean(errors.client)}
        aria-describedby={errors.client ? 'client-error' : undefined}
      />
      {errors.client && (
        <span className={styles.error} id="client-error">
          {errors.client}
        </span>
      )}

      <label htmlFor="serviceType">Tipo de servicio</label>
      <select
        id="serviceType"
        name="serviceType"
        value={values.serviceType}
        onChange={updateField}
      >
        {serviceTypes.map((serviceType) => (
          <option key={serviceType.value} value={serviceType.value}>
            {serviceType.label}
          </option>
        ))}
      </select>

      <label htmlFor="description">Descripcion</label>
      <textarea
        id="description"
        name="description"
        value={values.description}
        onChange={updateField}
        placeholder="Notas breves de la tarea"
        aria-invalid={Boolean(errors.description)}
        aria-describedby={errors.description ? 'description-error' : undefined}
      />
      {errors.description && (
        <span className={styles.error} id="description-error">
          {errors.description}
        </span>
      )}

      <label htmlFor="priority">Prioridad</label>
      <select
        id="priority"
        name="priority"
        value={values.priority}
        onChange={updateField}
      >
        <option value="high">Alta</option>
        <option value="medium">Media</option>
        <option value="low">Baja</option>
      </select>

      <label htmlFor="dueDate">Fecha limite</label>
      <input
        id="dueDate"
        name="dueDate"
        type="date"
        value={values.dueDate}
        onChange={updateField}
      />

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default memo(TaskForm);
