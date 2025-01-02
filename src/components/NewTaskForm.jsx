import { useState } from 'react';
import PropTypes from 'prop-types';

function NewTaskForm({ onAddTask }) {
  const [inputValue, setInputValue] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Если пользователь ничего не ввел, устанавливаем время на 0:00
    const minutes = minute ? parseInt(minute) : 0;
    const seconds = second ? parseInt(second) : 0;

    // Валидация таймера
    if (isNaN(minutes) || minutes < 0) {
      alert('Minutes must be a positive integer');
      return;
    }

    if (isNaN(seconds) || seconds < 0 || seconds > 59) {
      alert('Seconds must be between 0 and 59');
      return;
    }

    // Если данные корректны, добавляем задачу
    onAddTask(inputValue.trim(), minutes, seconds);

    // Очищаем форму
    setInputValue('');
    setMinute('');
    setSecond('');
  };

  return (
    <form className="new-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="new-todo"
        placeholder="Task description"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
      />
      <input
        type="number"
        className="new-todo-form__timer"
        placeholder="Min"
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
      />
      <input
        type="number"
        className="new-todo-form__timer"
        placeholder="Sec"
        value={second}
        onChange={(e) => setSecond(e.target.value)}
      />
      <button type="submit"></button>
    </form>
  );
}

NewTaskForm.propTypes = {
  onAddTask: PropTypes.func.isRequired, // Функция для добавления новой задачи
};

export default NewTaskForm;
