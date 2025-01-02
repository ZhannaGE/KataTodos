import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

function Task({
  id,
  description,
  createdAt,
  completed,
  isEditing,
  onToggleTask,
  onRemoveTask,
  onEditTask,
  onSaveTask,
  onCancelEdit,
  minutes,
  seconds,
}) {
  const [timeLabel, setTimeLabel] = useState('');
  const [editedDescription, setEditedDescription] = useState(description);

  const [timerMinutes, setTimerMinutes] = useState(minutes);
  const [timerSeconds, setTimerSeconds] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingUp, setIsCountingUp] = useState(minutes === 0 && seconds === 0);

  // Загружаем состояние таймера из localStorage при монтировании
  useEffect(() => {
    const savedTime = JSON.parse(localStorage.getItem('timerState'));
    if (savedTime && savedTime.id === id) {
      setTimerMinutes(savedTime.minutes);
      setTimerSeconds(savedTime.seconds);
    }
  }, [id]);

  useEffect(() => {
    let timerInterval;
    if (isRunning && !completed) {
      timerInterval = setInterval(() => {
        if (isCountingUp) {
          setTimerSeconds((prevSeconds) => {
            if (prevSeconds === 59) {
              setTimerMinutes((prevMinutes) => prevMinutes + 1);
              return 0;
            }
            return prevSeconds + 1;
          });
        } else {
          if (timerMinutes === 0 && timerSeconds === 0) {
            setIsRunning(false);
            return;
          }
          if (timerSeconds === 0) {
            setTimerMinutes((prevMinutes) => prevMinutes - 1);
            setTimerSeconds(59);
          } else {
            setTimerSeconds((prevSeconds) => prevSeconds - 1);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, isCountingUp, timerMinutes, timerSeconds, completed]);

  // Сохраняем состояние таймера в localStorage при изменении времени
  useEffect(() => {
    if (isRunning) {
      const timerState = {
        id,
        minutes: timerMinutes,
        seconds: timerSeconds,
      };
      localStorage.setItem('timerState', JSON.stringify(timerState));
    }
  }, [id, timerMinutes, timerSeconds, isRunning]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    const updateTimeLabel = () => {
      const timeDifference = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      if (timeDifference < 60) {
        setTimeLabel(`created less than ${timeDifference} seconds ago`);
      } else {
        setTimeLabel(`created ${formatDistanceToNow(new Date(createdAt), { addSuffix: true })}`);
      }
    };

    updateTimeLabel();
    const intervalId = setInterval(updateTimeLabel, 5000);
    return () => clearInterval(intervalId);
  }, [createdAt]);

  const handleSave = () => {
    if (editedDescription.trim()) {
      onSaveTask(id, editedDescription.trim());
    }
  };

  const handleInputChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onCancelEdit(id);
  };

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={() => onToggleTask(id)} />
        {!isEditing ? (
          <>
            <label>
              <span className="description">{description}</span>
              <span className="description">
                <button className={`icon ${isRunning ? 'icon-pause' : 'icon-play'}`} onClick={handlePlayPause}></button>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </span>
              <span className="created">{timeLabel}</span>
            </label>
            <button className="icon icon-edit" onClick={() => onEditTask(id)}></button>
            <button className="icon icon-destroy" onClick={() => onRemoveTask(id)}></button>
          </>
        ) : (
          <input
            type="text"
            className="edit"
            value={editedDescription}
            onChange={handleInputChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </li>
  );
}

Task.propTypes = {
  id: PropTypes.number.isRequired, // Уникальный идентификатор задачи
  description: PropTypes.string.isRequired, // Описание задачи
  createdAt: PropTypes.instanceOf(Date).isRequired, // Время создания задачи (должно быть экземпляром Date)
  completed: PropTypes.bool.isRequired, // Статус задачи (выполнена или нет)
  isEditing: PropTypes.bool.isRequired, // Флаг редактирования задачи
  onToggleTask: PropTypes.func.isRequired, // Функция для переключения состояния задачи
  onRemoveTask: PropTypes.func.isRequired, // Функция для удаления задачи
  onEditTask: PropTypes.func.isRequired, // Функция для начала редактирования задачи
  onSaveTask: PropTypes.func.isRequired, // Функция для сохранения редактированной задачи
  onCancelEdit: PropTypes.func.isRequired, // Функция для отмены редактирования
  minutes: PropTypes.number.isRequired, // Проп для минут
  seconds: PropTypes.number.isRequired, // Проп для секунд
};

export default Task;
