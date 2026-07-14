import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceTypes } from '../context/TaskContext';
import styles from './TaskItem.module.css';

const priorityLabels = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja'
};

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDueDate(dueDate) {
  const [year, month, day] = dueDate.split('-');
  return `${day}/${month}/${year}`;
}

function getDueDateState(task) {
  if (!task.dueDate || task.completed) {
    return null;
  }

  const today = getTodayDateString();

  if (task.dueDate < today) {
    return 'overdue';
  }

  if (task.dueDate === today) {
    return 'today';
  }

  return 'upcoming';
}

function TaskItem({ task, onRemove, onToggle }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const priority = task.priority ?? 'medium';
  const dueDateState = getDueDateState(task);
  const serviceTypeLabel =
    serviceTypes.find((serviceType) => serviceType.value === task.serviceType)?.label ??
    'Otro';

  function handleRemove() {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    onRemove(task.id);
  }

  return (
    <article className={`${styles.item} ${task.completed ? styles.completed : ''}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span>{task.completed ? 'Completada' : 'Pendiente'}</span>
      </label>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{serviceTypeLabel}</h3>
          <span className={styles.client}>{task.client}</span>
          <span className={`${styles.priority} ${styles[priority]}`}>
            {priorityLabels[priority]}
          </span>
          {task.dueDate && (
            <span
              className={`${styles.dueDate} ${
                dueDateState ? styles[dueDateState] : ''
              }`}
            >
              {dueDateState === 'overdue' && 'Vencida '}
              {dueDateState === 'today' && 'Vence hoy '}
              {dueDateState === 'upcoming' && 'Proxima '}
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className={styles.actions}>
        {!isConfirmingDelete && <Link to={`/tasks/${task.id}/edit`}>Editar</Link>}
        {isConfirmingDelete && (
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => setIsConfirmingDelete(false)}
          >
            Cancelar
          </button>
        )}
        <button
          className={isConfirmingDelete ? styles.confirmButton : ''}
          type="button"
          onClick={handleRemove}
        >
          {isConfirmingDelete ? 'Confirmar' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}

export default memo(TaskItem);
