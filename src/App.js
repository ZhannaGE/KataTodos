import { useState, useMemo } from 'react';

import NewTaskForm from './components/NewTaskForm';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Создаем состояние для задач, с начальным значением пустого массива
  const [tasks, setTasks] = useState([]);
  // Создаем состояние для фильтра с начальным значением 'all' (все задачи)
  const [filter, setFilter] = useState('all'); // Фильтрация задач: 'all' - все, 'active' - активные, 'completed' - завершенные

  const addTask = (description, minutes, seconds) => {
    const newTask = {
      id: Date.now(), // Уникальный идентификатор
      description, // Описание задачи
      minutes: parseInt(minutes, 10) || 0, // Преобразуем минуты в число
      seconds: parseInt(seconds, 10) || 0, // Преобразуем секунды в число
      createdAt: new Date(), // Дата создания
      completed: false, // Статус выполнения задачи
      isEditing: false, // Режим редактирования задачи
    };

    // Добавляем новую задачу в массив
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Функция для переключения состояния задачи (активна/завершена)
  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) => (task.id === id ? { ...task, completed: !task.completed } : task) // Переключаем статус задачи
      )
    );
  };

  // Функция для очистки всех задач
  const clearTasks = () => {
    setTasks([]); // Очищаем список задач
  };

  // Функция для удаления задачи по ID
  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Удаляем задачу из списка
  };

  // Функция для перехода в режим редактирования задачи
  const editTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) => (task.id === id ? { ...task, isEditing: true } : task) // Включаем режим редактирования для задачи
      )
    );
  };

  // Функция для сохранения изменений в задаче
  const saveTask = (id, newDescription) => {
    if (!newDescription.trim()) return; // Если описание пустое, не сохраняем
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: newDescription.trim(), isEditing: false } : task
      )
    );
  };

  // Функция для отмены редактирования задачи
  const cancelEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) => (task.id === id ? { ...task, isEditing: false } : task) // Выход из режима редактирования без сохранения изменений
      )
    );
  };

  // Мемоизированная функция для фильтрации задач
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'active') return !task.completed; // Показываем только активные задачи
      if (filter === 'completed') return task.completed; // Показываем только завершенные задачи
      return true; // Для 'all' показываем все задачи
    });
  }, [tasks, filter]); // Пересчитываем фильтрацию при изменении задач или фильтра

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        {/* Компонент для добавления новой задачи */}
        <NewTaskForm onAddTask={addTask} />
      </header>
      <section className="main">
        {/* Компонент для отображения списка задач */}
        <TaskList
          tasks={filteredTasks} // Передаем отфильтрованные задачи
          onToggleTask={toggleTask} // Функция для переключения состояния задачи
          onRemoveTask={removeTask} // Функция для удаления задачи
          onEditTask={editTask} // Функция для редактирования задачи
          onSaveTask={saveTask} // Функция для сохранения изменений
          onCancelEdit={cancelEdit} // Функция для отмены редактирования
        />
        {/* Компонент для отображения фильтров и очистки завершенных задач */}
        <Footer
          tasksLeft={tasks.filter((task) => !task.completed).length} // Количество незавершенных задач
          onClearCompleted={clearTasks} // Функция для очистки всех задач
          currentFilter={filter} // Текущий фильтр
          onFilterChange={setFilter} // Функция для изменения фильтра
        />
      </section>
    </section>
  );
}

export default App;
