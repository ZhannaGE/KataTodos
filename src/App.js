import { useState, useMemo, useEffect } from 'react';

import NewTaskForm from './components/NewTaskForm';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Состояние для задач
  const [tasks, setTasks] = useState([]);
  // Состояние для фильтра
  const [filter, setFilter] = useState('all');

  // Функция добавления новой задачи
  const addTask = (description, minutes, seconds) => {
    const newTask = {
      id: Date.now(), // Уникальный идентификатор
      description, // Описание задачи
      minutes: parseInt(minutes, 10) || 0, // Минуты задачи
      seconds: parseInt(seconds, 10) || 0, // Секунды задачи
      createdAt: new Date(), // Дата создания
      completed: false, // Статус задачи
      isEditing: false, // Режим редактирования
      isRunning: false, // Состояние таймера
      elapsedTime: 0, // Время, прошедшее с начала
      isCountingUp: false, // Флаг для увеличения времени
    };

    // Если пользователь ввел время, то начинаем с этого времени, иначе с 0:00
    if (newTask.minutes || newTask.seconds) {
      newTask.elapsedTime = newTask.minutes * 60 + newTask.seconds; // Начальное время в секундах
      newTask.isCountingUp = false; // Если есть время, то оно будет уменьшаться
    } else {
      newTask.elapsedTime = 0;
      newTask.isCountingUp = true; // Если времени нет, начинаем с 0 и увеличиваем
    }

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Функция для переключения состояния задачи (активна/завершена)
  const toggleTask = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Функция для очистки всех задач
  const clearTasks = () => {
    setTasks([]);
  };

  // Функция для удаления задачи
  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Функция для редактирования задачи
  const editTask = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isEditing: true } : task)));
  };

  // Функция для сохранения изменений
  const saveTask = (id, newDescription) => {
    if (!newDescription.trim()) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: newDescription.trim(), isEditing: false } : task
      )
    );
  };

  // Функция для отмены редактирования
  const cancelEdit = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isEditing: false } : task)));
  };

  // Функция для старта/паузы таймера
  const toggleTimer = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isRunning: !task.isRunning } : task)));
  };

  // Функция для сброса времени таймера
  const resetTimer = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, elapsedTime: task.minutes * 60 + task.seconds, isRunning: false } : task
      )
    );
  };

  // Функция для обновления времени таймера
  const updateTimer = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.isRunning) {
          if (task.isCountingUp) {
            // Увеличиваем время
            const newElapsedTime = task.elapsedTime + 1; // Увеличиваем время на 1 секунду
            const minutes = Math.floor(newElapsedTime / 60);
            const seconds = newElapsedTime % 60;

            return {
              ...task,
              elapsedTime: newElapsedTime,
              minutes,
              seconds,
            };
          } else {
            // Уменьшаем время
            if (task.elapsedTime > 0) {
              const newElapsedTime = task.elapsedTime - 1; // Уменьшаем время на 1 секунду
              const minutes = Math.floor(newElapsedTime / 60);
              const seconds = newElapsedTime % 60;

              return {
                ...task,
                elapsedTime: newElapsedTime,
                minutes,
                seconds,
              };
            } else {
              // Если время закончилось, останавливаем таймер
              return { ...task, isRunning: false };
            }
          }
        }
        return task;
      })
    );
  };

  // Эффект для обновления таймера каждую секунду
  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval); // Очистка интервала
  }, []); // Эффект не зависит от задач, потому что мы обновляем все задачи на каждом цикле

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  }, [tasks, filter]);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm onAddTask={addTask} />
      </header>
      <section className="main">
        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onRemoveTask={removeTask}
          onEditTask={editTask}
          onSaveTask={saveTask}
          onCancelEdit={cancelEdit}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
        />
        <Footer
          tasksLeft={tasks.filter((task) => !task.completed).length}
          onClearCompleted={clearTasks}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
      </section>
    </section>
  );
}

export default App;
