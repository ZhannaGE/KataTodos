import PropTypes from 'prop-types';

const FILTERS = ['all', 'active', 'completed'];

function TasksFilter({ currentFilter, onFilterChange }) {
  return (
    <ul className="filters">
      {FILTERS.map((filter) => (
        <li key={filter}>
          <button className={currentFilter === filter ? 'selected' : ''} onClick={() => onFilterChange(filter)}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        </li>
      ))}
    </ul>
  );
}

TasksFilter.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TasksFilter;
