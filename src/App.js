import { useState, useMemo, useEffect } from 'react';

import NewTaskForm from './components/NewTaskForm';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const addTask = (description, minutes, seconds) => {
    const totalSeconds = (parseInt(minutes, 10) || 0) * 60 + (parseInt(seconds, 10) || 0);
    const newTask = {
      id: Date.now(),
      description,
      createdAt: new Date(),
      completed: false,
      isEditing: false,
      isRunning: false,
      elapsedTime: totalSeconds,
      isCountingUp: totalSeconds === 0, //логика для увеличения времени, если пользователь ничего не ввел, показалось интересно
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const clearTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const editTask = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isEditing: true } : task)));
  };

  const saveTask = (id, newDescription) => {
    if (!newDescription.trim()) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: newDescription.trim(), isEditing: false } : task
      )
    );
  };

  const cancelEdit = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isEditing: false } : task)));
  };

  const toggleTimer = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isRunning: !task.isRunning } : task)));
  };

  const resetTimer = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, elapsedTime: task.elapsedTime, isRunning: false } : task))
    );
  };

  const updateTimer = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.isRunning) {
          if (task.isCountingUp) {
            const newElapsedTime = task.elapsedTime + 1;
            return { ...task, elapsedTime: newElapsedTime };
          } else {
            if (task.elapsedTime > 0) {
              const newElapsedTime = task.elapsedTime - 1;
              return { ...task, elapsedTime: newElapsedTime };
            } else {
              return { ...task, isRunning: false };
            }
          }
        }
        return task;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
