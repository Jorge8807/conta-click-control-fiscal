import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

function TaskList({ tasks, onClearFilters, onRemove, onToggle }) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <p>No hay tareas que coincidan con los filtros actuales.</p>
        <button type="button" onClick={onClearFilters}>
          Ver todas
        </button>
      </div>
    );
  }

  return (
    <section className={styles.list} aria-label="Listado de tareas">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onRemove={onRemove}
          onToggle={onToggle}
        />
      ))}
    </section>
  );
}

export default TaskList;
