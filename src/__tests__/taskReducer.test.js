import { actions, taskReducer } from '../context/TaskContext';

const baseTask = {
  id: 'task-test',
  client: 'Conta Click',
  serviceType: 'accounting',
  description: 'Descripcion inicial',
  priority: 'medium',
  dueDate: '2026-06-25',
  completed: false,
  createdAt: '2026-06-24T12:00:00.000Z'
};

describe('taskReducer', () => {
  test('agrega una nueva tarea al inicio de la lista', () => {
    const nextState = taskReducer([baseTask], {
      type: actions.add,
      payload: {
        client: ' Cliente fiscal ',
        serviceType: 'declaration',
        description: ' Descripcion ',
        priority: 'high',
        dueDate: '2026-06-30'
      }
    });

    expect(nextState).toHaveLength(2);
    expect(nextState[0]).toMatchObject({
      client: 'Cliente fiscal',
      serviceType: 'declaration',
      description: 'Descripcion',
      priority: 'high',
      dueDate: '2026-06-30',
      completed: false
    });
  });

  test('edita una tarea existente', () => {
    const nextState = taskReducer([baseTask], {
      type: actions.edit,
      payload: {
        id: 'task-test',
        client: 'Cliente actualizado',
        serviceType: 'finance',
        description: 'Texto actualizado',
        priority: 'low',
        dueDate: '2026-07-01'
      }
    });

    expect(nextState[0].client).toBe('Cliente actualizado');
    expect(nextState[0].serviceType).toBe('finance');
    expect(nextState[0].description).toBe('Texto actualizado');
    expect(nextState[0].priority).toBe('low');
    expect(nextState[0].dueDate).toBe('2026-07-01');
  });

  test('cambia el estado de completado', () => {
    const nextState = taskReducer([baseTask], {
      type: actions.toggle,
      payload: 'task-test'
    });

    expect(nextState[0].completed).toBe(true);
  });

  test('elimina una tarea', () => {
    const nextState = taskReducer([baseTask], {
      type: actions.remove,
      payload: 'task-test'
    });

    expect(nextState).toHaveLength(0);
  });

  test('elimina solo las tareas completadas', () => {
    const completedTask = {
      ...baseTask,
      id: 'task-completed',
      completed: true
    };

    const nextState = taskReducer([baseTask, completedTask], {
      type: actions.removeCompleted
    });

    expect(nextState).toHaveLength(1);
    expect(nextState[0].id).toBe('task-test');
  });
});
