import PropTypes from 'prop-types';

import TasksFilter from './TasksFilter';

function Footer({ tasksLeft, onClearCompleted, currentFilter, onFilterChange }) {
  return (
    <footer className="footer">
      <span className="todo-count">{tasksLeft} items left</span>

      <TasksFilter currentFilter={currentFilter} onFilterChange={onFilterChange} />

      {/* Кнопка для очистки завершенных задач */}
      <button className="clear-completed" onClick={onClearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.propTypes = {
  tasksLeft: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Footer;
