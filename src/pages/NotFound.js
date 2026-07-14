import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="not-found">
      <h2>Pagina no encontrada</h2>
      <p>La ruta solicitada no existe o la tarea ya fue eliminada.</p>
      <Link to="/tasks">Volver al listado</Link>
    </section>
  );
}

export default NotFound;
