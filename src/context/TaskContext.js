import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import { loadTasks, saveTasks } from '../utils/storage';

const TaskContext = createContext(null);

const serviceTypes = [
  { label: 'Declaracion', value: 'declaration' },
  { label: 'Contabilidad', value: 'accounting' },
  { label: 'Facturacion', value: 'billing' },
  { label: 'Nomina', value: 'payroll' },
  { label: 'Conciliacion', value: 'reconciliation' },
  { label: 'Tramite SAT', value: 'sat' },
  { label: 'Documentacion', value: 'documentation' },
  { label: 'Finanzas', value: 'finance' },
  { label: 'Otro', value: 'other' }
];

const initialTasks = [
  {
    id: 'task-1',
    client: 'Conta Click',
    serviceType: 'documentation',
    description: 'Confirmar expediente fiscal, documentos pendientes y rutas del flujo.',
    priority: 'high',
    dueDate: '2026-06-25',
    completed: false,
    createdAt: '2026-06-24T12:00:00.000Z'
  },
  {
    id: 'task-2',
    client: 'Despacho fiscal demo',
    serviceType: 'accounting',
    description: 'Revisar balanza, XML y conciliaciones del periodo.',
    priority: 'medium',
    dueDate: '2026-06-23',
    completed: true,
    createdAt: '2026-06-24T13:00:00.000Z'
  }
];

const actions = {
  add: 'ADD_TASK',
  edit: 'EDIT_TASK',
  remove: 'REMOVE_TASK',
  removeCompleted: 'REMOVE_COMPLETED_TASKS',
  toggle: 'TOGGLE_TASK'
};

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTasks(tasks) {
  return tasks.map((task) => ({
    ...task,
    client: task.client ?? 'Sin cliente',
    serviceType: task.serviceType ?? 'other',
    priority: task.priority ?? 'medium',
    dueDate: task.dueDate ?? ''
  }));
}

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1
};

function compareByDueDate(taskA, taskB) {
  const dateA = taskA.dueDate || '9999-12-31';
  const dateB = taskB.dueDate || '9999-12-31';

  return dateA.localeCompare(dateB);
}

function compareByPriority(taskA, taskB) {
  return (priorityRank[taskB.priority] ?? 0) - (priorityRank[taskA.priority] ?? 0);
}

function compareByRecent(taskA, taskB) {
  return new Date(taskB.createdAt).getTime() - new Date(taskA.createdAt).getTime();
}

function sortTasks(tasks, sortBy) {
  return [...tasks].sort((taskA, taskB) => {
    if (sortBy === 'dueDate') {
      return compareByDueDate(taskA, taskB) || compareByPriority(taskA, taskB);
    }

    if (sortBy === 'priority') {
      return compareByPriority(taskA, taskB) || compareByDueDate(taskA, taskB);
    }

    if (sortBy === 'recent') {
      return compareByRecent(taskA, taskB);
    }

    return (
      Number(taskA.completed) - Number(taskB.completed) ||
      compareByDueDate(taskA, taskB) ||
      compareByPriority(taskA, taskB) ||
      compareByRecent(taskA, taskB)
    );
  });
}

function taskReducer(state, action) {
  switch (action.type) {
    case actions.add:
      return [
        {
          id: createTaskId(),
          client: action.payload.client.trim(),
          serviceType: action.payload.serviceType,
          description: action.payload.description.trim(),
          priority: action.payload.priority,
          dueDate: action.payload.dueDate,
          completed: false,
          createdAt: new Date().toISOString()
        },
        ...state
      ];
    case actions.edit:
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              client: action.payload.client.trim(),
              serviceType: action.payload.serviceType,
              description: action.payload.description.trim(),
              priority: action.payload.priority,
              dueDate: action.payload.dueDate
            }
          : task
      );
    case actions.remove:
      return state.filter((task) => task.id !== action.payload);
    case actions.removeCompleted:
      return state.filter((task) => !task.completed);
    case actions.toggle:
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    default:
      return state;
  }
}

export function TaskProvider({ children, storageKey = 'react-final-tasks' }) {
  const [tasks, dispatch] = useReducer(
    taskReducer,
    storageKey,
    (key) => normalizeTasks(loadTasks(key) ?? initialTasks)
  );
  const [filter, setFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [search, setSearch] = useState('');

  useEffect(() => {
    saveTasks(storageKey, tasks);
  }, [storageKey, tasks]);

  const addTask = useCallback((task) => {
    dispatch({ type: actions.add, payload: task });
  }, []);

  const editTask = useCallback((task) => {
    dispatch({ type: actions.edit, payload: task });
  }, []);

  const removeTask = useCallback((taskId) => {
    dispatch({ type: actions.remove, payload: taskId });
  }, []);

  const removeCompletedTasks = useCallback(() => {
    dispatch({ type: actions.removeCompleted });
  }, []);

  const toggleTask = useCallback((taskId) => {
    dispatch({ type: actions.toggle, payload: taskId });
  }, []);

  const clearFilters = useCallback(() => {
    setFilter('all');
    setClientFilter('all');
    setPriorityFilter('all');
    setServiceTypeFilter('all');
    setSortBy('recommended');
    setSearch('');
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed
    };
  }, [tasks]);

  const clients = useMemo(
    () =>
      [...new Set(tasks.map((task) => task.client).filter(Boolean))].sort((clientA, clientB) =>
        clientA.localeCompare(clientB)
      ),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const nextTasks = tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && !task.completed) ||
        (filter === 'completed' && task.completed);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesClient = clientFilter === 'all' || task.client === clientFilter;
      const matchesServiceType =
        serviceTypeFilter === 'all' || task.serviceType === serviceTypeFilter;

      const matchesSearch =
        !searchTerm ||
        task.client.toLowerCase().includes(searchTerm) ||
        serviceTypes
          .find((serviceType) => serviceType.value === task.serviceType)
          ?.label.toLowerCase()
          .includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm);

      return (
        matchesFilter &&
        matchesClient &&
        matchesPriority &&
        matchesServiceType &&
        matchesSearch
      );
    });

    return sortTasks(nextTasks, sortBy);
  }, [clientFilter, filter, priorityFilter, search, serviceTypeFilter, sortBy, tasks]);

  const value = useMemo(
    () => ({
      tasks,
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
      editTask,
      removeTask,
      removeCompletedTasks,
      toggleTask,
      clearFilters,
      setFilter,
      setClientFilter,
      setPriorityFilter,
      setServiceTypeFilter,
      setSortBy,
      setSearch
    }),
    [
      tasks,
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
      editTask,
      removeTask,
      removeCompletedTasks,
      toggleTask,
      clearFilters
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks debe usarse dentro de TaskProvider');
  }

  return context;
}

export { actions, taskReducer, initialTasks, serviceTypes };
