import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Stats from '../components/Stats';
import { useTasks } from '../context/TaskContext';
import styles from './Dashboard.module.css';

function Dashboard() {
  const {
    filteredTasks,
    clients,
    clientFilter,
    filter,
    priorityFilter,
    serviceTypeFilter,
    sortBy,
    search,
    stats,
    addTask,
    clearFilters,
    removeCompletedTasks,
    removeTask,
    toggleTask,
    setClientFilter,
    setFilter,
    setPriorityFilter,
    setServiceTypeFilter,
    setSortBy,
    setSearch
  } = useTasks();

  return (
    <div className={styles.dashboard}>
      <section className={styles.panel}>
        <h2>Nueva tarea</h2>
        <TaskForm onSubmit={addTask} />
      </section>

      <section className={styles.tasks}>
        <div className={styles.heading}>
          <div>
            <p>Organiza tus pendientes</p>
            <h2>Mis tareas</h2>
          </div>
          <Stats stats={stats} />
        </div>
        <TaskFilters
          clients={clients}
          currentClient={clientFilter}
          currentFilter={filter}
          currentPriority={priorityFilter}
          currentServiceType={serviceTypeFilter}
          currentSort={sortBy}
          search={search}
          onFilterChange={setFilter}
          onPriorityChange={setPriorityFilter}
          onServiceTypeChange={setServiceTypeFilter}
          onSortChange={setSortBy}
          onSearchChange={setSearch}
          onClearFilters={clearFilters}
          onClientChange={setClientFilter}
          completedCount={stats.completed}
          onRemoveCompleted={removeCompletedTasks}
        />
        <TaskList
          tasks={filteredTasks}
          onClearFilters={clearFilters}
          onRemove={removeTask}
          onToggle={toggleTask}
        />
      </section>
    </div>
  );
}

export default Dashboard;
