import PropTypes from 'prop-types';

// Список доступных фильтров для отображения задач
const FILTERS = ['all', 'active', 'completed'];

function TasksFilter({ currentFilter, onFilterChange }) {
  return (
    // Список фильтров для отображения на экране
    <ul className="filters">
      {FILTERS.map((filter) => (
        <li key={filter}>
          {/*
            Для каждой кнопки фильтра проверяем, является ли текущий фильтр активным.
            Если фильтр совпадает с текущим, добавляем класс 'selected' для подсветки.
          */}
          <button
            className={currentFilter === filter ? 'selected' : ''} // Класс 'selected' для активного фильтра
            onClick={() => onFilterChange(filter)} // При клике вызываем onFilterChange с соответствующим фильтром
          >
            {/* Капитализация первой буквы фильтра, чтобы сделать текст более читаемым */}
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        </li>
      ))}
    </ul>
  );
}

TasksFilter.propTypes = {
  // currentFilter должен быть строкой, указывающей текущий активный фильтр
  currentFilter: PropTypes.string.isRequired,
  // onFilterChange должен быть функцией, которая изменяет текущий фильтр
  onFilterChange: PropTypes.func.isRequired,
};

export default TasksFilter;
