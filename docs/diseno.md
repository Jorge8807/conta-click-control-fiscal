# Documento de Diseno - Conta Click

## Objetivo

Construir una aplicacion web para controlar las tareas fiscales y financieras del despacho Conta Click. El sistema debe facilitar el seguimiento por cliente, servicio, prioridad y fecha limite, y demostrar el uso de React, Hooks, React Router, Context API, CSS Modules, pruebas unitarias y persistencia local.

## Paleta de colores

- Azul principal: `#2563eb`
- Azul oscuro: `#1d4ed8`
- Texto principal: `#102033`
- Texto secundario: `#41536a`
- Fondo general: `#f4f7fb`
- Superficie: `#ffffff`
- Bordes: `#dbe4f0`
- Error/eliminar: `#b42318`

## Tipografia

Se usa una pila tipografica de sistema para rendimiento y legibilidad:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## Estructura de componentes

```text
App
  Header
  Routes
    Dashboard
      TaskForm
      Stats
      TaskFilters
      TaskList
        TaskItem
    EditTask
      TaskForm
    NotFound
```

## Pantallas

### Listado de tareas

- Header con la identidad de Conta Click y navegacion.
- Panel lateral o superior para crear nuevas tareas.
- Resumen con total, pendientes y completadas.
- Filtros por estado, cliente, prioridad y tipo de servicio.
- Buscador por cliente, servicio o descripcion.
- Ordenamiento recomendado o por fecha limite.
- Lista de tarjetas de tareas con acciones.

### Formulario de edicion

- Ruta dinamica `/tasks/:taskId/edit`.
- Formulario precargado con los datos de la tarea.
- Boton para guardar cambios.
- Enlace para volver al listado.

## Wireframe

```text
+-----------------------------------------------------------------------+
| Conta Click - Control Fiscal                           [Tareas]        |
+-----------------------------------------------------------------------+
| Nueva tarea             | Mis tareas                                   |
| [Cliente]               | [Total] [Pendientes] [Completadas]           |
| [Tipo de servicio]      | [Todas] [Pendientes] [Completadas]           |
| [Descripcion]           | [Cliente] [Prioridad] [Tipo] [Orden]         |
| [Prioridad] [Fecha]     | [Buscar por cliente, servicio o descripcion] |
| [Agregar tarea]         | - Servicio [Editar] [Eliminar]               |
+-----------------------------------------------------------------------+
```

## Estado global

El estado principal vive en `TaskContext` y se administra con `useReducer`.

Estados:

- `tasks`: arreglo de tareas.
- `filter`: filtro activo (`all`, `pending`, `completed`).
- `search`: termino de busqueda.
- `clientFilter`: cliente seleccionado.
- `priorityFilter`: prioridad seleccionada.
- `serviceTypeFilter`: tipo de servicio seleccionado.
- `sortBy`: criterio de ordenamiento.

Acciones:

- `ADD_TASK`
- `EDIT_TASK`
- `REMOVE_TASK`
- `TOGGLE_TASK`
- `REMOVE_COMPLETED_TASKS`

Datos calculados:

- `filteredTasks`
- `stats.total`
- `stats.pending`
- `stats.completed`

## Rutas y navegacion

- `/`: redirecciona a `/tasks`.
- `/tasks`: pantalla principal.
- `/tasks/:taskId/edit`: pantalla para editar tarea.
- `*`: pagina no encontrada.

## Accesibilidad y responsive

- Formularios con `label` asociado a cada campo.
- Estados de error con `aria-invalid` y `aria-describedby`.
- Navegacion con `aria-label`.
- Layout adaptable: dos columnas en escritorio y una columna en pantallas pequenas.
- Foco visible en controles interactivos.
