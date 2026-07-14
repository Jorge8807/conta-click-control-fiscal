# Conta Click - Control Fiscal

Aplicacion web para organizar los servicios fiscales y financieros del despacho Conta Click. Permite registrar pendientes por cliente, dar seguimiento a fechas limite y consultar rapidamente la carga de trabajo. Los datos se guardan en `localStorage`.

## Tecnologias

- React con componentes funcionales y Hooks
- React Router
- Context API con reducer
- CSS Modules
- Jest y React Testing Library
- Persistencia con localStorage

## Instalacion

```bash
npm install
npm start
```

La aplicacion se abrira en `http://localhost:3000`.

## Compilacion

```bash
npm run build
```

La version optimizada se genera en `build/`.

## Pruebas

```bash
npm test
```

## Estructura

```text
src/
  components/   Componentes reutilizables
  context/      Estado global de tareas
  hooks/        Hooks personalizados
  pages/        Vistas principales
  styles/       Estilos globales
  utils/        Funciones de apoyo
  __tests__/    Pruebas unitarias
```

## Funcionalidades principales

- Crear tareas por cliente y tipo de servicio.
- Registrar descripcion, prioridad y fecha limite.
- Marcar tareas como completadas o pendientes.
- Editar tareas mediante ruta dinamica.
- Eliminar una tarea o limpiar todas las completadas con confirmacion.
- Filtrar por todas, pendientes y completadas.
- Filtrar por cliente, prioridad y tipo de servicio.
- Buscar por cliente, servicio o descripcion.
- Ordenar los pendientes por el criterio recomendado o por fecha limite.
- Guardar datos en el navegador con localStorage.
- Diseno responsive y controles accesibles.

## Rutas

- `/tasks`: listado, filtros, busqueda y formulario de alta.
- `/tasks/:taskId/edit`: formulario para editar una tarea existente.
- `*`: pantalla de pagina no encontrada.

## Despliegue en Netlify

El archivo `netlify.toml` configura el comando de compilacion, la carpeta `build` y la redireccion necesaria para que React Router funcione al abrir una ruta directamente.

1. Conectar el repositorio en Netlify.
2. Confirmar `npm run build` como comando de compilacion.
3. Confirmar `build` como directorio de publicacion.
4. Publicar el sitio.

## Alcance

Esta version es un MVP de uso local. Para operar con varias personas o dispositivos se requiere autenticacion y una base de datos compartida.
