import PropTypes from 'prop-types';
import Task from './Task';

function TaskList({
  tasks, // Массив задач, которые нужно отобразить
  onToggleTask, // Функция для переключения состояния задачи (выполнена/не выполнена)
  onRemoveTask, // Функция для удаления задачи
  onEditTask, // Функция для начала редактирования задачи
  onSaveTask, // Функция для сохранения отредактированной задачи
  onCancelEdit, // Функция для отмены редактирования задачи
}) {
  return (
    <ul className="todo-list">
      {tasks.map((task) => {
        const { id, description, createdAt, completed, isEditing, minutes, seconds } = task;

        return (
          <Task
            key={id}
            id={id}
            description={description}
            createdAt={createdAt}
            completed={completed}
            isEditing={isEditing}
            onToggleTask={onToggleTask}
            onRemoveTask={onRemoveTask}
            onEditTask={onEditTask}
            onSaveTask={onSaveTask}
            onCancelEdit={onCancelEdit}
            minutes={minutes} // Передаем минуты
            seconds={seconds} // Передаем секунды
          />
        );
      })}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      completed: PropTypes.bool.isRequired,
      isEditing: PropTypes.bool.isRequired,
      minutes: PropTypes.number.isRequired, // Минуты
      seconds: PropTypes.number.isRequired, // Секунды
    })
  ).isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onSaveTask: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default TaskList;
