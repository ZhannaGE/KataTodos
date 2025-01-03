import Task from './Task';

function TaskList({
  tasks,
  onToggleTask,
  onRemoveTask,
  onEditTask,
  onSaveTask,
  onCancelEdit,
  onToggleTimer,
  onResetTimer,
}) {
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <Task
          key={task.id}
          {...task}
          onToggleTask={onToggleTask}
          onRemoveTask={onRemoveTask}
          onEditTask={onEditTask}
          onSaveTask={onSaveTask}
          onCancelEdit={onCancelEdit}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
        />
      ))}
    </ul>
  );
}

export default TaskList;
