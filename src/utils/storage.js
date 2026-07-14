export function loadTasks(storageKey) {
  try {
    const rawTasks = window.localStorage.getItem(storageKey);
    return rawTasks ? JSON.parse(rawTasks) : null;
  } catch (error) {
    return null;
  }
}

export function saveTasks(storageKey, tasks) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    return false;
  }

  return true;
}
