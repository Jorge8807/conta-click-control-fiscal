import { useState } from 'react';
import { serviceTypes } from '../context/TaskContext';
import styles from './TaskFilters.module.css';

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' }
];

function TaskFilters({
  clients,
  currentClient,
  currentFilter,
  currentPriority,
  currentServiceType,
  currentSort,
  search,
  onFilterChange,
  onPriorityChange,
  onServiceTypeChange,
  onSortChange,
  onSearchChange,
  onClearFilters,
  onClientChange,
  completedCount,
  onRemoveCompleted
}) {
  const [isConfirmingClearCompleted, setIsConfirmingClearCompleted] = useState(false);
  const hasActiveFilters =
    currentFilter !== 'all' ||
    currentClient !== 'all' ||
    currentPriority !== 'all' ||
    currentServiceType !== 'all' ||
    currentSort !== 'recommended' ||
    search.trim() !== '';

  function handleRemoveCompleted() {
    if (!isConfirmingClearCompleted) {
      setIsConfirmingClearCompleted(true);
      return;
    }

    onRemoveCompleted();
    setIsConfirmingClearCompleted(false);
  }

  return (
    <section className={styles.filters} aria-label="Filtros de tareas">
      <div className={styles.filterGroup}>
        {filters.map((filter) => (
          <button
            className={currentFilter === filter.value ? styles.active : ''}
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className={styles.fieldGrid}>
        <label className={styles.selectLabel} htmlFor="client-filter">
          Cliente
          <select
            id="client-filter"
            value={currentClient}
            onChange={(event) => onClientChange(event.target.value)}
          >
            <option value="all">Todos</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectLabel} htmlFor="priority-filter">
          Prioridad
          <select
            id="priority-filter"
            value={currentPriority}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </label>
        <label className={styles.selectLabel} htmlFor="service-type-filter">
          Tipo
          <select
            id="service-type-filter"
            value={currentServiceType}
            onChange={(event) => onServiceTypeChange(event.target.value)}
          >
            <option value="all">Todos</option>
            {serviceTypes.map((serviceType) => (
              <option key={serviceType.value} value={serviceType.value}>
                {serviceType.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectLabel} htmlFor="sort-by">
          Orden
          <select
            id="sort-by"
            value={currentSort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="recommended">Recomendado</option>
            <option value="dueDate">Fecha limite</option>
            <option value="priority">Prioridad</option>
            <option value="recent">Recientes</option>
          </select>
        </label>
        <label className={styles.searchLabel} htmlFor="search">
          Buscar
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cliente, tipo o descripcion"
          />
        </label>
      </div>
      <div className={styles.actionsRow}>
        {hasActiveFilters && (
          <button className={styles.clearButton} type="button" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        )}
        {completedCount > 0 && (
          <div className={styles.bulkActions}>
            {isConfirmingClearCompleted && (
              <button
                className={styles.cancelButton}
                type="button"
                onClick={() => setIsConfirmingClearCompleted(false)}
              >
                Cancelar
              </button>
            )}
            <button
              className={isConfirmingClearCompleted ? styles.confirmButton : styles.clearButton}
              type="button"
              onClick={handleRemoveCompleted}
            >
              {isConfirmingClearCompleted
                ? 'Confirmar completadas'
                : `Eliminar completadas (${completedCount})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default TaskFilters;
