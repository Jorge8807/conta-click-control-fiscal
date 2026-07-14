import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { TaskProvider } from '../context/TaskContext';
import { addDaysToLocalDate, formatLocalDate } from '../utils/date';

let testId = 0;

function renderApp({ initialEntries = ['/tasks'], storedTasks } = {}) {
  testId += 1;
  const storageKey = `test-tasks-${testId}`;

  if (storedTasks) {
    window.localStorage.setItem(storageKey, JSON.stringify(storedTasks));
  }

  const result = render(
    <MemoryRouter initialEntries={initialEntries}>
      <TaskProvider storageKey={storageKey}>
        <App />
      </TaskProvider>
    </MemoryRouter>
  );

  return { ...result, storageKey };
}

function getControl(id) {
  return document.getElementById(id);
}

describe('App', () => {
  test('muestra la identidad de Conta Click', () => {
    renderApp();

    expect(screen.getByText('Conta Click', { selector: 'header p' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Control Fiscal' })).toBeInTheDocument();
  });

  test('permite crear una tarea nueva', async () => {
    renderApp();

    userEvent.type(getControl('client'), 'Cliente Fiscal ABC');
    userEvent.selectOptions(getControl('serviceType'), 'declaration');
    userEvent.type(getControl('description'), 'Presentar declaracion mensual');
    userEvent.selectOptions(getControl('priority'), 'high');
    userEvent.type(getControl('dueDate'), '2026-06-30');
    userEvent.click(screen.getByRole('button', { name: /agregar tarea/i }));

    expect(await screen.findByText('Presentar declaracion mensual')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente Fiscal ABC')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Declaracion')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Alta')[0]).toBeInTheDocument();
    expect(screen.getByText(/30\/06\/2026/)).toBeInTheDocument();
  });

  test('permite editar una tarea desde su ruta', async () => {
    renderApp({ initialEntries: ['/tasks/task-1/edit'] });

    userEvent.clear(getControl('client'));
    userEvent.type(getControl('client'), 'Cliente actualizado');
    userEvent.clear(getControl('description'));
    userEvent.type(getControl('description'), 'Expediente fiscal actualizado');
    userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(screen.getByText('Expediente fiscal actualizado')).toBeInTheDocument();
      expect(screen.getByText('Cliente actualizado', { selector: 'span' })).toBeInTheDocument();
    });
  });

  test('permite marcar una tarea como completada desde la interfaz', async () => {
    renderApp();

    const pendingCheckbox = screen.getByRole('checkbox', { name: 'Pendiente' });
    userEvent.click(pendingCheckbox);

    await waitFor(() => {
      expect(pendingCheckbox).toBeChecked();
      expect(screen.getAllByRole('checkbox', { name: 'Completada' })).toHaveLength(2);
    });
  });

  test('busca tareas por su descripcion', async () => {
    renderApp();

    userEvent.type(getControl('search'), 'balanza');

    expect(await screen.findByText(/revisar balanza/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/confirmar expediente fiscal/i)).not.toBeInTheDocument();
    });
  });

  test('muestra errores cuando faltan campos obligatorios', async () => {
    renderApp();

    userEvent.click(screen.getByRole('button', { name: /agregar tarea/i }));

    expect(await screen.findByText('El cliente es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('La descripcion es obligatoria.')).toBeInTheDocument();
    expect(getControl('client')).toHaveAttribute('aria-invalid', 'true');
    expect(getControl('description')).toHaveAttribute('aria-invalid', 'true');
  });

  test('recupera tareas guardadas en localStorage', () => {
    const storedTask = {
      id: 'stored-task',
      client: 'Cliente persistente',
      serviceType: 'finance',
      description: 'Tarea recuperada del navegador',
      priority: 'low',
      dueDate: addDaysToLocalDate(2),
      completed: false,
      createdAt: new Date().toISOString()
    };

    renderApp({ storedTasks: [storedTask] });

    expect(screen.getByText('Tarea recuperada del navegador')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente persistente')[0]).toBeInTheDocument();
  });

  test('muestra la pagina no encontrada para una ruta invalida', () => {
    renderApp({ initialEntries: ['/ruta-inexistente'] });

    expect(screen.getByRole('heading', { name: 'Pagina no encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al listado' })).toHaveAttribute(
      'href',
      '/tasks'
    );
  });

  test('filtra las tareas completadas', async () => {
    renderApp();

    userEvent.click(screen.getByRole('button', { name: /^completadas$/i }));

    expect(screen.getByText('Revisar balanza, XML y conciliaciones del periodo.')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Confirmar expediente fiscal')).not.toBeInTheDocument();
    });
  });

  test('pide confirmacion antes de eliminar una tarea', async () => {
    renderApp();

    userEvent.click(screen.getAllByRole('button', { name: /^eliminar$/i })[0]);

    expect(screen.getByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/confirmar expediente fiscal/i)).not.toBeInTheDocument();
    });
  });

  test('filtra las tareas por prioridad', async () => {
    renderApp();

    userEvent.selectOptions(getControl('priority-filter'), 'high');

    expect(await screen.findByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/revisar balanza/i)).not.toBeInTheDocument();
    });
  });

  test('filtra las tareas por cliente', async () => {
    renderApp();

    userEvent.selectOptions(getControl('client-filter'), 'Conta Click');

    expect(await screen.findByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/revisar balanza/i)).not.toBeInTheDocument();
    });
  });

  test('filtra las tareas por tipo de servicio', async () => {
    renderApp();

    userEvent.selectOptions(getControl('service-type-filter'), 'documentation');

    expect(await screen.findByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/revisar balanza/i)).not.toBeInTheDocument();
    });
  });

  test('muestra fechas limite en las tareas', () => {
    renderApp();

    expect(screen.getByText(new RegExp(formatLocalDate(addDaysToLocalDate(3))))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(formatLocalDate(addDaysToLocalDate(1))))).toBeInTheDocument();
  });

  test('ordena tareas por fecha limite', async () => {
    renderApp();

    userEvent.selectOptions(getControl('sort-by'), 'dueDate');

    await waitFor(() => {
      const taskTitles = screen.getAllByRole('heading', { level: 3 });
      expect(taskTitles[0]).toHaveTextContent('Contabilidad');
      expect(taskTitles[1]).toHaveTextContent('Documentacion');
    });
  });

  test('limpia filtros activos desde los controles', async () => {
    renderApp();

    userEvent.selectOptions(getControl('priority-filter'), 'high');
    expect(await screen.findByRole('button', { name: /limpiar/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /limpiar/i }));

    expect(await screen.findByText(/revisar balanza/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument();
  });

  test('permite volver a todas las tareas desde el estado vacio', async () => {
    renderApp();

    userEvent.type(getControl('search'), 'sin resultados');

    expect(
      await screen.findByText(/no hay tareas que coincidan con los filtros actuales/i)
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /ver todas/i }));

    expect(await screen.findByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
    expect(screen.getByText(/revisar balanza/i)).toBeInTheDocument();
  });

  test('elimina tareas completadas con confirmacion', async () => {
    renderApp();

    userEvent.click(screen.getByRole('button', { name: /eliminar completadas/i }));

    expect(screen.getByText(/revisar balanza/i)).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /confirmar completadas/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /confirmar completadas/i }));

    await waitFor(() => {
      expect(screen.queryByText(/revisar balanza/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/confirmar expediente fiscal/i)).toBeInTheDocument();
  });
});
