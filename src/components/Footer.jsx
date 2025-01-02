import PropTypes from 'prop-types';

import TasksFilter from './TasksFilter';

function Footer({ tasksLeft, onClearCompleted, currentFilter, onFilterChange }) {
  return (
    <footer className="footer">
      {/* Отображаем количество оставшихся задач */}
      <span className="todo-count">{tasksLeft} items left</span>

      {/* Компонент для отображения фильтра задач */}
      <TasksFilter
        currentFilter={currentFilter} // Передаем текущий фильтр
        onFilterChange={onFilterChange} // Передаем функцию для изменения фильтра
      />

      {/* Кнопка для очистки завершенных задач */}
      <button className="clear-completed" onClick={onClearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.propTypes = {
  tasksLeft: PropTypes.number.isRequired, // Количество оставшихся задач (число)
  onClearCompleted: PropTypes.func.isRequired, // Функция для очистки завершенных задач
  currentFilter: PropTypes.string.isRequired, // Текущий фильтр задач ('all', 'active', 'completed')
  onFilterChange: PropTypes.func.isRequired, // Функция для изменения фильтра задач
};

export default Footer;
