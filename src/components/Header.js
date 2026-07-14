import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Conta Click</p>
        <h1>Control Fiscal</h1>
      </div>
      <nav className={styles.nav} aria-label="Navegacion principal">
        <NavLink to="/tasks">Tareas</NavLink>
      </nav>
    </header>
  );
}

export default Header;
