import styles from './Stats.module.css';

function Stats({ stats }) {
  return (
    <section className={styles.stats} aria-label="Resumen de tareas">
      <div>
        <span>{stats.total}</span>
        <p>Total</p>
      </div>
      <div>
        <span>{stats.pending}</span>
        <p>Pendientes</p>
      </div>
      <div>
        <span>{stats.completed}</span>
        <p>Completadas</p>
      </div>
    </section>
  );
}

export default Stats;
