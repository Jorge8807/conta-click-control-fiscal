import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../context/TaskContext';
import styles from './EditTask.module.css';

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, editTask } = useTasks();
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (!task) {
    return <Navigate to="/not-found" replace />;
  }

  function handleSubmit(values) {
    editTask({ id: task.id, ...values });
    navigate('/tasks');
  }

  return (
    <section className={styles.edit}>
      <Link to="/tasks" className={styles.backLink}>
        Volver a tareas
      </Link>
      <h2>Editar tarea</h2>
      <TaskForm
        initialValues={{
          client: task.client,
          serviceType: task.serviceType,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate
        }}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default EditTask;
