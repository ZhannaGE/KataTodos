import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

function Task({
  id,
  description,
  createdAt,
  completed,
  isEditing,
  isRunning,
  elapsedTime,
  onToggleTask,
  onRemoveTask,
  onEditTask,
  onSaveTask,
  onCancelEdit,
  onToggleTimer,
  onResetTimer,
}) {
  const [editedDescription, setEditedDescription] = useState(description);

  const formatTime = (elapsedTime) => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggleTimer = () => onToggleTimer(id);
  const handleResetTimer = () => onResetTimer(id);

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

  useEffect(() => {
    if (!isEditing) {
      setEditedDescription(description);
    }
  }, [isEditing, description]);

  const [timeLabel, setTimeLabel] = useState('');
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

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => onToggleTask(id)}
          onClick={handleResetTimer}
        />
        {!isEditing ? (
          <>
            <label>
              <span className="description">{description}</span>
              <span className="description">
                <button className={`icon icon-${isRunning ? 'pause' : 'play'}`} onClick={handleToggleTimer}></button>
                {formatTime(elapsedTime)}
              </span>
              <span className="description">{timeLabel}</span>

              <button className="icon icon-edit" onClick={() => onEditTask(id)}></button>
              <button className="icon icon-destroy" onClick={() => onRemoveTask(id)}></button>
            </label>
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
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  completed: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isRunning: PropTypes.bool.isRequired,
  elapsedTime: PropTypes.number.isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onSaveTask: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onToggleTimer: PropTypes.func.isRequired,
  onResetTimer: PropTypes.func.isRequired,
};

export default Task;
